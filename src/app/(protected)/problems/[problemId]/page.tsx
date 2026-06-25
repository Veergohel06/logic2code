'use client';

import { use, useState, useEffect } from 'react';
import { useEditor } from '@/frontend/hooks/useEditor';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { PROBLEMS } from '@/config/problems';
import ProblemStatement from '@/frontend/components/problem/ProblemStatement';
import LogicBreakdown from '@/frontend/components/problem/LogicBreakdown';
import MonacoEditor from '@/frontend/components/editor/MonacoEditor';
import EditorToolbar from '@/frontend/components/editor/EditorToolbar';
import OutputPanel from '@/frontend/components/editor/OutputPanel';
import CodeCriticPanel from '@/frontend/components/editor/CodeCriticPanel';
import MemoryVisualizer from '@/frontend/components/visualizer/MemoryVisualizer';
import CompareLanguagesPanel from '@/frontend/components/problem/CompareLanguagesPanel';
import TutorChat from '@/frontend/components/tutor/TutorChat';
import { ArrowLeft, MessageSquare, Layers } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '@/config/languages';
import { useProgress } from '@/frontend/hooks/useProgress';

interface PageProps {
  params: Promise<{
    problemId: string;
  }>;
}

export default function ProblemDetailPage({ params }: PageProps) {
  const { problemId } = use(params);
  const { language, compareMode, theme } = useLanguage();
  const { completeProblem, isProblemCompleted } = useProgress();
  
  // Find problem inside active language or search globally
  const getProblem = () => {
    const list = PROBLEMS[language] || [];
    const found = list.find((p) => p.id === problemId);
    if (found) return found;

    // Global lookup fallback
    for (const langId in PROBLEMS) {
      const p = PROBLEMS[langId].find((p) => p.id === problemId);
      if (p) return p;
    }
    return null;
  };

  const problem = getProblem();

  const {
    code,
    updateCode,
    output,
    isRunning,
    runCode,
    isReviewing,
    reviewCode,
    reviewResult,
    dryRunSteps,
    currentStepIndex,
    setCurrentStepIndex,
    isSimulated
  } = useEditor(problemId);

  const handleExportReport = () => {
    const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
    const timestamp = new Date().toLocaleString();
    
    let markdown = `# Logic2Code AI - Study Guide & Execution Report\n\n`;
    markdown += `Generated on: **${timestamp}**  \n`;
    markdown += `Problem: **${problem?.title || problemId}**  \n`;
    markdown += `Target Language: **${activeLang.name}**\n\n`;
    
    markdown += `## 1. Problem Description\n\n`;
    if (problem) {
      markdown += `### Description\n${problem.description}\n\n`;
      markdown += `### Input Specification\n${problem.inputSpec}\n\n`;
      markdown += `### Output Specification\n${problem.outputSpec}\n\n`;
      if (problem.constraints && problem.constraints.length > 0) {
        markdown += `### Constraints\n`;
        problem.constraints.forEach((c: string) => {
          markdown += `- ${c}\n`;
        });
        markdown += `\n`;
      }
    }
    
    markdown += `## 2. Source Code\n\n`;
    markdown += `\`\`\`${activeLang.monacoLang || language}\n${code}\n\`\`\`\n\n`;
    
    markdown += `## 3. Execution Logs\n\n`;
    if (output) {
      markdown += `\`\`\`text\n${output}\n\`\`\`\n\n`;
    } else {
      markdown += `*No execution output logs available for this session.*\n\n`;
    }
    
    markdown += `## 4. Visualizer Dry-Run Trace\n\n`;
    if (dryRunSteps && dryRunSteps.length > 0) {
      markdown += `The following table traces the variable states across the execution steps:\n\n`;
      markdown += `| Step | Line | Variables / Scope State |\n`;
      markdown += `| :--- | :--- | :--- |\n`;
      dryRunSteps.forEach((step: any, index: number) => {
        const variablesStr = step.variables && Object.keys(step.variables).length > 0
          ? Object.entries(step.variables).map(([k, v]) => `\`${k}\` = \`${JSON.stringify(v)}\``).join(', ')
          : '*None*';
        markdown += `| ${index + 1} | Line ${step.line} | ${variablesStr} |\n`;
      });
      markdown += `\n`;
    } else {
      markdown += `*No dry-run execution steps recorded. Run code with output to generate trace.*\n\n`;
    }
    
    markdown += `## 5. AI Critic Feedback & Complexity Profile\n\n`;
    if (reviewResult) {
      markdown += `### Summary\n${reviewResult.review}\n\n`;
      markdown += `### Complexity Profile\n`;
      markdown += `- **Time Complexity:** \`${reviewResult.complexity.time}\` (${reviewResult.complexity.timeReason})\n`;
      markdown += `- **Space Complexity:** \`${reviewResult.complexity.space}\` (${reviewResult.complexity.spaceReason})\n\n`;
      
      if (reviewResult.annotations && reviewResult.annotations.length > 0) {
        markdown += `### Annotations\n`;
        reviewResult.annotations.forEach((ann: any) => {
          markdown += `- **Line ${ann.line}** [${ann.type.toUpperCase()}]: ${ann.message}\n`;
        });
        markdown += `\n`;
      }
      
      if (reviewResult.alternativeCode) {
        markdown += `### Recommended Optimization\n`;
        markdown += `\`\`\`${activeLang.monacoLang || language}\n${reviewResult.alternativeCode}\n\`\`\`\n\n`;
      }
    } else {
      markdown += `*No AI Critic feedback generated. Click "AI Review" to analyze code.*\n\n`;
    }
    
    markdown += `---\n*Generated by Logic2Code AI Playground.*`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `study_report_${problemId}_${language}_${new Date().toISOString().slice(0,10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'editor' | 'tutor'>('editor');
  const [isCriticOpen, setIsCriticOpen] = useState<boolean>(false);

  // Trigger confetti upon successful run (when output is set, and it doesn't represent an error or initial state)
  useEffect(() => {
    if (output && !output.includes('Error:') && !output.startsWith('$')) {
      import('canvas-confetti').then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899']
        });
      });
    }
  }, [output]);

  if (!problem) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-1">Error</span>
        <h2 className="text-lg font-black text-slate-400 mb-4">Problem Not Found</h2>
        <Link href="/problems" className="text-xs font-bold text-blue-500 hover:underline">
          Return to Exercises
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-6 py-2 relative min-h-screen page-transition">
      {/* Background aesthetics - Colorful lights for glass reflection */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 -z-10 pointer-events-none" />
      <div className="absolute top-[15%] left-[5%] w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse duration-[8s]" />
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 animate-fade-in">
        <Link href="/problems" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercises</span>
        </Link>
        <span className="text-[10px] text-slate-400 font-bold font-mono">
          Language Mode: <strong className="text-blue-400 uppercase">{language}</strong>
        </span>
      </div>

      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Details & Logic Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-6 animate-slide-in-left">
          <ProblemStatement problem={problem} isCompleted={isProblemCompleted(problemId, language)} />
          <LogicBreakdown problemId={problemId} />
        </div>

        {/* Right Column: Code Editor, Simulated Terminal, and Critic Panel */}
        <motion.div
          layout
          className="lg:col-span-8 flex flex-col xl:flex-row gap-6 items-start w-full animate-slide-up delay-1"
        >
          {/* Main Editor & Output Box - Glassmorphic Container */}
          <motion.div
            layout
            className="flex-grow flex flex-col gap-0 glass-spatial rounded-3xl overflow-hidden shadow-lg w-full border border-white/10 shadow-spatial-glow-blue/5"
          >
            <EditorToolbar
              onRun={() => runCode(code, () => {
                completeProblem(problemId, language);
              })}
              isRunning={isRunning}
              onReview={() => {
                setIsCriticOpen(true);
                reviewCode(code);
              }}
              isReviewing={isReviewing}
              onExport={handleExportReport}
            />
            <div className="p-4 bg-slate-900/60 backdrop-blur-md border-t border-white/5">
              <MonacoEditor
                value={code}
                onChange={updateCode}
                executingLine={dryRunSteps.length > 0 && activeWorkspaceTab === 'editor' ? dryRunSteps[currentStepIndex]?.line : undefined}
                theme={theme}
              />
              <OutputPanel
                output={output}
                reviewResult={reviewResult ? reviewResult.review : null}
                onCloseReview={() => {}}
                isSimulated={isSimulated}
              />
            </div>
          </motion.div>

          {/* AI Code Critic Side Drawer */}
          <AnimatePresence mode="popLayout">
            {isCriticOpen && (
              <CodeCriticPanel
                key="critic-panel"
                isOpen={isCriticOpen}
                onClose={() => setIsCriticOpen(false)}
                reviewResult={reviewResult}
                isReviewing={isReviewing}
                onApplyCode={updateCode}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Compare Languages Panel (Side view option) */}
      {compareMode && (
        <div className="w-full mt-2 animate-slide-down">
          <CompareLanguagesPanel problemId={problemId} />
        </div>
      )}

      {/* Workspace Tabs (Visualizer vs Tutor) - Glass Sliding Style */}
      <div className="flex glass-spatial p-1.5 rounded-2xl w-fit mb-2 mt-4 self-center shadow-sm animate-slide-up delay-2">
        <button
          onClick={() => setActiveWorkspaceTab('editor')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer hover-lift hover-scale ${
            activeWorkspaceTab === 'editor'
              ? 'bg-blue-600 text-white shadow-md border border-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4.5 h-4.5 text-blue-300" />
          <span>Execution Visualizer</span>
        </button>
        <button
          onClick={() => setActiveWorkspaceTab('tutor')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer hover-lift hover-scale ${
            activeWorkspaceTab === 'tutor'
              ? 'bg-indigo-600 text-white shadow-md border border-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4.5 h-4.5 text-indigo-300" />
          <span>AI Tutor Session</span>
        </button>
      </div>

      {/* Sub Workspace View */}
      <div className="w-full animate-slide-up delay-3">
        {activeWorkspaceTab === 'editor' ? (
          <div className="animate-fade-in">
            <MemoryVisualizer
              steps={dryRunSteps}
              currentStepIndex={currentStepIndex}
              onStepChange={setCurrentStepIndex}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <TutorChat problemId={problemId} />
          </div>
        )}
      </div>
    </div>
  );
}
