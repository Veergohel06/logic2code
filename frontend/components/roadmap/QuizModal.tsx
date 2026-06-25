'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { Sparkles, X, CheckCircle2, AlertCircle, ArrowRight, Loader2, Award } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeTitle: string;
  onComplete: (xpEarned: number) => void;
}

export default function QuizModal({ isOpen, onClose, nodeId, nodeTitle, onComplete }: QuizModalProps) {
  const { careerGoal, language } = useLanguage();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (isOpen && nodeId) {
      setLoading(true);
      setCurrentIdx(0);
      setSelectedOpt(null);
      setAnswered(false);
      setScore(0);
      setQuizFinished(false);

      fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, careerGoal, language })
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setQuestions(data.quizzes || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, nodeId, careerGoal, language]);

  if (!isOpen) return null;

  const handleSelectOption = (idx: number) => {
    if (answered) return;
    setSelectedOpt(idx);
    setAnswered(true);
    
    const correct = idx === questions[currentIdx].answerIndex;
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setAnswered(false);
    } else {
      setQuizFinished(true);
      // Trigger Confetti
      import('canvas-confetti').then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      });
      // Award XP
      onComplete(50);
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] animate-fade-in glass-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Roadmap Assessment</span>
              <span className="text-xs font-black text-white leading-tight block">{nodeTitle}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                Loading Questions
              </span>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Assembling dynamic quiz nodes matching roadmap curricula...
              </p>
            </div>
          ) : quizFinished ? (
            /* Finished screen */
            <div className="flex-grow flex flex-col items-center justify-center text-center gap-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center text-emerald-400 mb-2">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Assessment Cleared</span>
                <h3 className="text-xl font-black text-white leading-tight">Quiz Completed!</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  You scored <strong className="text-white">{score} out of {questions.length}</strong> correct.
                </p>
              </div>

              <div className="bg-indigo-950/40 border border-indigo-900/30 rounded-2xl px-6 py-3 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span className="text-xs font-extrabold text-indigo-200 uppercase tracking-wider">+50 XP Awarded</span>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Continue Roadmap
              </button>
            </div>
          ) : currentQ ? (
            /* Question screen */
            <div className="flex flex-col gap-5 flex-grow">
              {/* Counter */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-[10px] text-slate-400 font-bold bg-white/5 border border-white/10 rounded-lg px-2 py-0.5">
                  XP: +50
                </span>
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-black text-white leading-snug">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="flex flex-col gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isCorrectAnswer = idx === currentQ.answerIndex;
                  const isSelected = idx === selectedOpt;
                  
                  let optStyle = 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-200';
                  if (answered) {
                    if (isCorrectAnswer) {
                      optStyle = 'border-emerald-900/30 bg-emerald-950/40 text-emerald-300';
                    } else if (isSelected) {
                      optStyle = 'border-rose-900/30 bg-rose-950/40 text-rose-300';
                    } else {
                      optStyle = 'border-white/5 bg-white/2 opacity-50 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={answered}
                      className={`w-full text-left px-4 py-3 border rounded-2xl text-xs font-semibold leading-relaxed transition-all cursor-pointer flex justify-between items-center gap-3 ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrectAnswer && (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                      )}
                      {answered && isSelected && !isCorrectAnswer && (
                        <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Trigger */}
              {answered && (
                <div className="mt-2 flex flex-col gap-3.5 bg-slate-950/40 border border-white/5 rounded-2xl p-4 animate-slide-down">
                  <div className="flex gap-2.5">
                    {selectedOpt === currentQ.answerIndex ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all self-end cursor-pointer"
                  >
                    <span>{currentIdx + 1 === questions.length ? 'Finish' : 'Next'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Failed to load questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
