'use client';

import { useState, useRef, useEffect } from 'react';
import { useTutor } from '@/frontend/hooks/useTutor';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import TutorMessage from './TutorMessage';
import ThinkingMode from './ThinkingMode';
import HintPanel from './HintPanel';
import { Send, Sparkles, MessageSquare, ArrowRight, Database, Trash2 } from 'lucide-react';

export default function TutorChat({ problemId }: { problemId?: string }) {
  const { messages, sendMessage, isThinking, hints, getHint, loadingHint, clearChat } = useTutor(problemId);
  const { language, careerGoal } = useLanguage();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    sendMessage(input);
    setInput('');
  };

  const getSuggestions = () => {
    if (careerGoal === 'data-analyst') {
      if (language === 'python') {
        return [
          'How do I filter rows with Pandas?',
          'Explain difference between .loc and .iloc in Python',
          'How do I handle missing CSV fields using Python?'
        ];
      }
      if (language === 'r') {
        return [
          'How do I filter rows using dplyr in R?',
          'Explain piping in R (%>% or |>)',
          'How do I handle NA values in a vector in R?'
        ];
      }
    }
    if (careerGoal === 'full-stack' && (language === 'javascript' || language === 'typescript')) {
      return [
        'How do I handle async/await try-catch?',
        'Explain how Express routing middleware works',
        'How do I write a basic React state hook?'
      ];
    }
    if (careerGoal === 'agentic-ai' && language === 'python') {
      return [
        'What is Model Context Protocol (MCP)?',
        'How do I define a tool schema for LLMs?',
        'Write a simple LangGraph agent loop in Python'
      ];
    }
    const langName = language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1);
    return [
      `Give me a logic challenge in ${langName}`,
      `Explain key variables and syntax rules in ${langName}`,
      'How do I write optimized loops?'
    ];
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[calc(100vh-240px)] xl:min-h-[600px]">
      {/* Chat Messages Section */}
      <div className="xl:col-span-2 flex flex-col glass-spatial rounded-3xl overflow-hidden h-[550px] xl:h-full border border-white/10 shadow-spatial-glow-blue/5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-slate-900/60 relative">
          {/* macOS Window Controls */}
          <div className="absolute top-1 left-2 flex items-center gap-1 select-none scale-75 opacity-70">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950/30 border border-blue-900/20 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white">AI Tutor Mentor</span>
              <span className="text-[10px] text-emerald-400 font-bold block">● Tutor Online</span>
            </div>
          </div>
          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearChat}
              title="Clear Chat History"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-900/30 hover:bg-rose-900/40 text-[10px] font-bold text-rose-400 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-900/30 text-[10px] font-bold text-indigo-400 shrink-0">
              <Database className="w-3 h-3" />
              <span>RAG Active</span>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div
          ref={scrollRef}
          className="flex-grow p-6 overflow-y-auto flex flex-col gap-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent custom-scrollbar"
        >
          {messages.map((msg) => (
            <TutorMessage key={msg.id} message={msg} />
          ))}
          {isThinking && <ThinkingMode />}

          {messages.length === 1 && !isThinking && (
            <div className="mt-4 flex flex-col gap-3 animate-fade-in">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Suggested Topics to Start
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {getSuggestions().map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(s)}
                    className="text-left p-4 bg-white/5 hover:bg-blue-950/20 border border-white/10 hover:border-blue-900/30 rounded-2xl text-xs font-bold text-slate-300 hover:text-blue-400 transition-all cursor-pointer shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 active:scale-98 leading-normal flex flex-col justify-between min-h-[6.5rem] h-auto spatial-3d-card"
                  >
                    <span>{s}</span>
                    <span className="text-[9px] font-extrabold text-blue-400 flex items-center gap-1 mt-2">
                      Ask Tutor <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-slate-900/60">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 focus-within:border-blue-500/50 focus-within:shadow-spatial-glow-blue/10 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for coding tips, logic explanations, or help resolving compile errors..."
              className="flex-grow bg-transparent text-sm text-white placeholder:text-slate-500 px-3.5 focus:outline-none py-2"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 text-slate-50 rounded-xl transition-all cursor-pointer disabled:text-slate-600"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar Utilities Panel (Hints, etc.) */}
      <div className="flex flex-col gap-6 xl:h-full">
        <HintPanel hints={hints} getHint={getHint} loadingHint={loadingHint} />

        <div className="glass-spatial rounded-3xl p-5 flex-grow flex flex-col justify-between border border-white/10 shadow-spatial-glow-indigo/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-extrabold text-white">Coach Guidelines</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold mb-3">
            Answers grounded in a curated knowledge base per language.
          </p>
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide border-b border-white/10 pb-1">
              RAG Knowledge Base
            </div>
            <ul className="list-disc list-inside text-xs text-slate-400 font-semibold space-y-1.5 leading-relaxed">
              <li>Python: pandas, generators, async, OOP</li>
              <li>JavaScript: event loop, closures, fetch</li>
              <li>TypeScript: generics, utility types</li>
              <li>Java: streams, collections, threading</li>
              <li>C++: pointers, smart ptrs, templates</li>
              <li>C: malloc, structs, file I/O</li>
              <li>Go: goroutines, channels, context</li>
              <li>R: dplyr, ggplot2, dataframes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
