'use client';

import { useState, useEffect } from 'react';
import useLanguage from './useLanguage';
import { LANGUAGES } from '@/config/languages';

interface VisualExecutionStep {
  line: number;
  variables: Record<string, string>;
  explanation: string;
  dataStructures?: Record<string, any>;
}

export function useEditor(problemId: string) {
  const { language, getDraft, setDraft } = useLanguage();
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<{
    review: string;
    complexity: {
      time: string;
      timeReason: string;
      space: string;
      spaceReason: string;
    };
    annotations: Array<{
      line: number;
      type: 'warning' | 'info' | 'success';
      message: string;
    }>;
    alternativeCode: string;
  } | null>(null);
  
  // Visual Dry Run Steps
  const [dryRunSteps, setDryRunSteps] = useState<VisualExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  
  // Compiler fallback transparency — true when API returned static mock output
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Reset output, steps, and step index when changing active language
  useEffect(() => {
    setOutput('');
    setDryRunSteps([]);
    setCurrentStepIndex(-1);
  }, [language]);

  const getActiveCode = () => {
    const draft = getDraft(problemId, language);
    if (draft) return draft;
    const langConfig = LANGUAGES.find((l) => l.id === language);
    return langConfig ? langConfig.defaultCode : '';
  };

  const updateCode = (newCode: string) => {
    setDraft(problemId, language, newCode);
  };

  const runCode = async (code: string, onSuccess?: () => void) => {
    setIsRunning(true);
    setOutput('Running compilation & dry-run analysis...\n');
    setDryRunSteps([]);
    setCurrentStepIndex(-1);

    try {
      const { supabase } = await import('@/database/supabaseClient');
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/ai/dryrun', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          selected_language: language,
          difficulty: 'Medium',
          problem_type: 'Logic Building',
          user_level: 'Explorer',
          code: code,
          problemId: problemId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const consoleOutput = data.consoleOutput || 'Success! Execution completed with no errors.';
        setOutput(consoleOutput);
        setIsSimulated(data.metadata?.realtime === false);
        if (data.steps && data.steps.length > 0) {
          setDryRunSteps(data.steps);
          setCurrentStepIndex(0);
        }

        const isError = consoleOutput.startsWith('Error:') || 
                        consoleOutput.startsWith('Compile Error:') || 
                        consoleOutput.startsWith('Runtime Exception:');
        
        if (!isError && data.metadata?.success !== false) {
          onSuccess?.();
        }
      } else {
        setOutput('Error: Connection failed. Visual simulation compiler offline.');
      }
    } catch (err) {
      setOutput('Error running code: ' + String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const reviewCode = async (code: string) => {
    setIsReviewing(true);
    setReviewResult(null);

    try {
      const { supabase } = await import('@/database/supabaseClient');
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          selected_language: language,
          difficulty: 'Medium',
          problem_type: 'Logic Building',
          user_level: 'Explorer',
          code: code,
          problemId: problemId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setReviewResult({
          review: data.review || 'No suggestions. Code looks perfect!',
          complexity: data.complexity || { time: 'O(N)', timeReason: 'Iterates through sequence.', space: 'O(1)', spaceReason: 'Constant workspace.' },
          annotations: data.annotations || [],
          alternativeCode: data.alternativeCode || ''
        });
      } else {
        setReviewResult({
          review: 'Could not fetch AI review suggestions at this time.',
          complexity: { time: 'N/A', timeReason: 'Error', space: 'N/A', spaceReason: 'Error' },
          annotations: [],
          alternativeCode: ''
        });
      }
    } catch (err) {
      setReviewResult({
        review: 'Error fetching review: ' + String(err),
        complexity: { time: 'N/A', timeReason: 'Error', space: 'N/A', spaceReason: 'Error' },
        annotations: [],
        alternativeCode: ''
      });
    } finally {
      setIsReviewing(false);
    }
  };

  return {
    code: getActiveCode(),
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
  };
}

export default useEditor;
