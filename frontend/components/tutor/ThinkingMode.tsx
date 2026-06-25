import { Bot } from 'lucide-react';

export default function ThinkingMode() {
  return (
    <div className="flex gap-4 w-full justify-start items-center animate-fade-in">
      <div className="w-9 h-9 rounded-xl bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-blue-400 shrink-0 animate-pulse shadow-sm shadow-blue-950/20">
        <Bot className="w-5 h-5" />
      </div>
      <div className="flex gap-1.5 items-center p-3 px-4 bg-white/5 border border-white/10 rounded-2xl">
        <span className="text-xs font-semibold text-slate-300">AI Tutor is formulating logic</span>
        <div className="flex gap-1 items-center ml-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
