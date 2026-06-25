'use client';

import { useLanguage } from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';
import { Play, SkipForward, RotateCcw, Box, ArrowRight, Layers, RefreshCw, Cpu, GitBranch } from 'lucide-react';

interface VisualExecutionStep {
  line: number;
  variables: Record<string, string>;
  explanation: string;
  dataStructures?: Record<string, any>;
}

interface MemoryVisualizerProps {
  steps: VisualExecutionStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

export default function MemoryVisualizer({ steps, currentStepIndex, onStepChange }: MemoryVisualizerProps) {
  const { language } = useLanguage();
  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  // Demo fallback steps if the user has not clicked Run Code yet
  const getDemoSteps = (langId: string): VisualExecutionStep[] => {
    switch (langId) {
      case 'python':
        return [
          {
            line: 2,
            variables: { data: '"hello world"' },
            explanation: 'Function solve_problem called with string input.',
            dataStructures: { type: 'list-dict', list: ['"h"', '"e"', '"l"', '"l"', '"o"'], dict: { status: '"success"', code: '200' } }
          },
          {
            line: 5,
            variables: { data: '"hello world"', result: '["h", "e", "l", "l", "o"]' },
            explanation: 'Array initialized from characters. Variable result declared in active stack frame.'
          }
        ];
      case 'javascript':
      case 'typescript':
        return [
          {
            line: 2,
            variables: { data: '"hello world"' },
            explanation: 'solveProblem pushed onto Call Stack.',
            dataStructures: { type: 'event-loop', stack: ['global()', 'solveProblem()'], webapis: ['fetchData()'], queue: ['onSuccessCallback()'] }
          },
          {
            line: 7,
            variables: { data: '"hello world"', result: '[]' },
            explanation: 'Callback event loop ticks. Call stack resolves active functions.'
          }
        ];
      case 'java':
        return [
          {
            line: 5,
            variables: { data: '"hello world"' },
            explanation: 'Solution.solveProblem() invoked. String reference allocated on Stack.',
            dataStructures: { type: 'oop-heap', stackRefs: { data: '0x32ff', result: '0x99fa' }, heapObjects: { '0x32ff': { type: 'String', value: '"hello world"' }, '0x99fa': { type: 'ArrayList', size: '0' } } }
          }
        ];
      case 'cpp':
      case 'c':
        return [
          {
            line: 8,
            variables: { data: '"hello world"' },
            explanation: 'solveProblem called. Memory allocated on Stack frame.',
            dataStructures: { type: 'pointers-heap', stack: { '0x7ffe1': { name: 'data', val: '0x9f300' }, '0x7ffe8': { name: 'ptr', val: '0x7ffe1' } }, heap: { '0x9f300': '"hello world"' } }
          }
        ];
      case 'go':
        return [
          {
            line: 5,
            variables: { data: '"hello world"' },
            explanation: 'Main goroutine spawns concurrent routine to solve problem.',
            dataStructures: { type: 'concurrency', goroutines: ['G1 (main) [runnable]', 'G2 (solveProblem) [executing]'], channels: { ch1: { buffer: ['"hello"', '"world"'], cap: 4 } } }
          }
        ];
      default:
        return [];
    }
  };

  const activeSteps = steps.length > 0 ? steps : getDemoSteps(language);
  const currentIndex = steps.length > 0 ? currentStepIndex : 0;
  const currentStep = activeSteps[currentIndex] || activeSteps[0];

  const handleNext = () => {
    if (currentIndex < activeSteps.length - 1) {
      onStepChange(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onStepChange(currentIndex - 1);
    }
  };

  const handleReset = () => {
    onStepChange(0);
  };

  // Render Language Specific Diagrams
  const renderDiagram = () => {
    const ds = currentStep?.dataStructures || activeSteps[0]?.dataStructures || {};
    
    switch (activeLang.visualizerType) {
      case 'list-dict':
        // Python Lists/Dicts Layout
        const listItems = ds.list || ['item0', 'item1', 'item2'];
        const dictItems = ds.dict || { key1: 'val1', key2: 'val2' };
        return (
          <div className="flex flex-col gap-5 w-full">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Python List Structure (Indexed Blocks)</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {listItems.map((val: string, idx: number) => (
                  <div key={idx} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-2 min-w-14 shadow-sm">
                    <span className="text-[9px] text-blue-400 font-bold mb-1">[{idx}]</span>
                    <span className="text-xs font-mono font-bold text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Python Dictionary (Hashing Mappings)</div>
              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3 max-w-sm shadow-sm">
                <table className="w-full text-left font-mono text-[11px] text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[9px] uppercase tracking-wider">
                      <th className="pb-1.5 font-bold">Key</th>
                      <th className="pb-1.5 font-bold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dictItems).map(([k, v]: any) => (
                      <tr key={k} className="border-b border-white/5 last:border-0">
                        <td className="py-2 text-yellow-500 font-bold">{k}</td>
                        <td className="py-2 text-slate-200">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'event-loop':
        // JS Event Loop Layout
        const callStack = ds.stack || ['global()'];
        const webApis = ds.webapis || [];
        const callbackQueue = ds.queue || [];
        return (
          <div className="grid grid-cols-2 gap-4 w-full text-slate-300">
            {/* Call Stack */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 flex flex-col min-h-36 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Call Stack
              </div>
              <div className="flex flex-col-reverse gap-1.5 mt-auto">
                {callStack.map((frame: string, idx: number) => (
                  <div key={idx} className="bg-blue-950/40 border border-blue-900/30 text-blue-200 font-mono text-[10px] font-bold py-1.5 px-3 rounded-lg text-center truncate">
                    {frame}
                  </div>
                ))}
              </div>
            </div>

            {/* Web APIs */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 min-h-36 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Web APIs (Async)
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                {webApis.length > 0 ? webApis.map((api: string, idx: number) => (
                  <div key={idx} className="bg-purple-950/40 border border-purple-900/30 text-purple-200 font-mono text-[10px] py-1.5 px-3 rounded-lg">
                    {api}
                  </div>
                )) : <div className="text-[10px] text-slate-500 italic mt-6 text-center">Empty</div>}
              </div>
            </div>

            {/* Callback Queue */}
            <div className="col-span-2 bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Callback Task Queue</div>
              <div className="flex gap-2 items-center overflow-x-auto py-1">
                {callbackQueue.length > 0 ? callbackQueue.map((cb: string, idx: number) => (
                  <div key={idx} className="bg-emerald-950/40 border border-emerald-900/30 text-emerald-300 font-mono text-[10px] py-1 px-2.5 rounded-lg shrink-0">
                    {cb}
                  </div>
                )) : <div className="text-[10px] text-slate-500 italic py-1">Queue Empty</div>}
              </div>
            </div>
          </div>
        );

      case 'oop-heap':
        // Java Heap Objects layout
        const jStack = ds.stackRefs || { data: '0x32ff' };
        const jHeap = ds.heapObjects || { '0x32ff': { type: 'String', value: '"hello"' } };
        return (
          <div className="grid grid-cols-2 gap-6 w-full font-mono text-[10px]">
            {/* Stack References */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Stack Frame (References)</div>
              <div className="flex flex-col gap-2">
                {Object.entries(jStack).map(([name, ref]: any) => (
                  <div key={name} className="flex justify-between items-center bg-white/5 border border-white/10 p-2 rounded-xl">
                    <span className="text-slate-300 font-bold">{name}</span>
                    <span className="text-blue-200 font-bold">{ref}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heap Objects */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Heap Memory (Allocated Objects)</div>
              <div className="flex flex-col gap-3">
                {Object.entries(jHeap).map(([addr, obj]: any) => (
                  <div key={addr} className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between border-b border-white/5 pb-1 mb-1">
                      <span className="text-slate-300 font-bold">{addr}</span>
                      <span className="text-emerald-300 font-extrabold">{obj.type}</span>
                    </div>
                    <span className="text-slate-300 font-semibold truncate">val: {obj.value || 'new instance'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pointers-heap':
        // C++ Stack/Heap Pointers Layout
        const cppStack = ds.stack || { '0x7ffe1': { name: 'data', val: '0x9f30' } };
        const cppHeap = ds.heap || { '0x9f30': '"hello"' };
        return (
          <div className="grid grid-cols-2 gap-6 w-full font-mono text-[10px]">
            {/* Stack Addresses */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Stack Memory (Local Addresses)</div>
              <div className="flex flex-col gap-2.5">
                {Object.entries(cppStack).map(([addr, item]: any) => (
                  <div key={addr} className="flex flex-col bg-white/5 border border-white/10 p-2 rounded-xl relative">
                    <span className="text-[8px] text-slate-400 absolute right-2 top-1.5">{addr}</span>
                    <span className="text-blue-200 font-bold">{item.name}</span>
                    <span className="text-slate-300 mt-1 font-semibold">value: {item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heap blocks */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Heap Memory (malloc/new)</div>
              <div className="flex flex-col gap-2">
                {Object.entries(cppHeap).map(([addr, val]: any) => (
                  <div key={addr} className="flex justify-between items-center bg-white/5 border border-white/10 p-2 rounded-xl">
                    <span className="text-slate-300 font-bold">{addr}</span>
                    <span className="text-amber-300 font-extrabold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'concurrency':
        // Go Concurrency / Channels Layout
        const goroutines = ds.goroutines || ['G1 (main)'];
        const channels = ds.channels || { ch1: { buffer: [], cap: 2 } };
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full font-mono text-[10px]">
            {/* Goroutines List */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" /> Go Routines Scheduler
              </div>
              <div className="flex flex-col gap-1.5">
                {goroutines.map((g: string, idx: number) => (
                  <div key={idx} className="bg-blue-950/40 border border-blue-900/30 text-blue-200 py-1.5 px-3 rounded-lg font-bold">
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* Channels buffers */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 shadow-sm">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Channels Communications</div>
              <div className="flex flex-col gap-3">
                {Object.entries(channels).map(([chName, ch]: any) => (
                  <div key={chName} className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 font-bold">{chName} (chan)</span>
                      <span className="text-slate-300 font-semibold">cap: {ch.buffer.length}/{ch.cap}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-white/5 min-h-8">
                      {ch.buffer.length > 0 ? ch.buffer.map((val: string, idx: number) => (
                        <div key={idx} className="bg-cyan-950/40 border border-cyan-900/30 text-cyan-200 font-bold p-1 px-2 rounded-md">
                           {val}
                        </div>
                      )) : <span className="text-[9px] text-slate-500 italic">No values in channel buffer</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="glass-spatial rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[500px]">
      {/* Player Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Sandbox Simulation
          </span>
          <span className="text-lg font-extrabold text-white">
            {activeLang.name} Visualizer
          </span>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            disabled={currentIndex <= 0}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer disabled:text-slate-600 disabled:bg-white/2 disabled:border-white/5 disabled:cursor-not-allowed select-none focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:text-slate-600 disabled:bg-white/2 disabled:border-white/5 disabled:cursor-not-allowed select-none focus:outline-none"
          >
            Prev
          </button>
          <span className="text-xs font-bold text-slate-400 px-1 font-mono select-none">
            {currentIndex + 1} / {activeSteps.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex >= activeSteps.length - 1}
            className="p-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:text-slate-600 disabled:bg-white/2 disabled:border-white/5 disabled:cursor-not-allowed select-none focus:outline-none"
          >
            Next
          </button>
        </div>
      </div>

      {/* Simulator Execution Explanation */}
      <div className="p-4 bg-blue-950/40 border border-blue-900/30 rounded-2xl mb-5">
        <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-wider block mb-1">
          Step Explanation (Line {currentStep?.line || 1})
        </span>
        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          {currentStep?.explanation || 'Simulation loading...'}
        </p>
        
        {/* Dynamic Variable Tracker Table */}
        {currentStep?.variables && Object.keys(currentStep.variables).length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-white/10">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Scope Bindings</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentStep.variables).map(([name, val]) => (
                <div key={name} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px]">
                  <span className="text-blue-300 font-bold">{name}:</span>
                  <span className="text-emerald-300 font-extrabold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Diagram Area */}
      <div className="flex-grow flex items-center justify-center border border-white/5 bg-slate-950/40 rounded-2xl p-4 min-h-64">
        {renderDiagram()}
      </div>
    </div>
  );
}
