'use client';

import { ChatMessage } from '@/frontend/hooks/useTutor';
import { Bot, User, BookOpen, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Specialized CodeBlock component with copy to clipboard and syntax highlighting
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const highlightCode = (rawCode: string) => {
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    let escaped = escapeHtml(rawCode);

    // Single line comments (// or #)
    escaped = escaped.replace(/(\/\/.*|#.*)/g, '<span class="text-slate-500 font-normal">$1</span>');

    // Strings (single and double quotes)
    escaped = escaped.replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="text-emerald-400">$1</span>');

    // Keywords
    const keywords = [
      'return', 'def', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
      'async', 'await', 'class', 'import', 'export', 'from', 'func', 'package', 'struct', 'public', 'private', 'void'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-blue-400 font-bold">$1</span>');

    // Built-ins & types
    const builtins = ['int', 'float', 'str', 'string', 'boolean', 'List', 'Map', 'Set', 'list', 'dict', 'number', 'any'];
    const builtinRegex = new RegExp(`\\b(${builtins.join('|')})\\b`, 'g');
    escaped = escaped.replace(builtinRegex, '<span class="text-purple-400">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-white/5 bg-slate-950/80 shadow-md">
      {/* Codeblock Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-slate-900/40 border-b border-white/5 text-[10px] text-slate-500 font-bold uppercase select-none">
        <span>{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-white/5 cursor-pointer flex items-center gap-1.5"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale-in" />
              <span className="text-[9px] text-emerald-400 font-bold lowercase normal-case">copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[9px] lowercase normal-case">copy</span>
            </>
          )}
        </button>
      </div>
      {/* Codeblock Body */}
      <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-100 leading-relaxed scrollbar-thin">
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}

export default function TutorMessage({ message }: { message: ChatMessage }) {
  const isAI = message.sender === 'ai';
  const hasSources = isAI && message.sources && message.sources.length > 0;
  const [showSources, setShowSources] = useState(false);

  // Heuristic: run typewriter if AI message is brand new (less than 4s old) and not welcome
  const isNewMessage = isAI && message.id !== 'welcome' && (Date.now() - new Date(message.timestamp).getTime() < 4000);
  const [displayedText, setDisplayedText] = useState(isNewMessage ? '' : message.text);
  const [isTyping, setIsTyping] = useState(isNewMessage);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(message.text);
      return;
    }

    let currentWordIndex = 0;
    const words = message.text.split(/(\s+)/);
    
    const interval = setInterval(() => {
      currentWordIndex += 2;
      if (currentWordIndex >= words.length) {
        setDisplayedText(message.text);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(words.slice(0, currentWordIndex).join(''));
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isTyping, message.text]);

  // Format inline or block code, bold, and bullet lists in messages
  const formatText = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(```[\s\S]*?```|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        // Code Block
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9+#-]+$/) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');
        return <CodeBlock key={i} code={code} lang={lang} />;
      } else if (part.startsWith('`')) {
        // Inline Code
        return (
          <code key={i} className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-blue-400 rounded-md text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      // Render markdown-like bold, numbered lists, and bullet points
      return (
        <span key={i} className="whitespace-pre-wrap leading-relaxed">
          {part.split('\n').map((line, li) => {
            // Bold **text**
            const boldified = line.split(/(\*\*.*?\*\*)/g).map((seg, si) => {
              if (seg.startsWith('**') && seg.endsWith('**')) {
                return <strong key={si} className="font-bold text-white">{seg.slice(2, -2)}</strong>;
              }
              return seg;
            });
            // Bullet list
            if (line.match(/^(\s*[-*])\s/)) {
              return <div key={li} className="flex gap-2 items-start my-0.5"><span className="text-blue-400 mt-0.5 shrink-0">•</span><span>{boldified}</span></div>;
            }
            // Numbered list
            if (line.match(/^\d+\.\s/)) {
              const [num, ...rest] = line.split(/(?<=^\d+\.)\s/);
              return <div key={li} className="flex gap-2 items-start my-0.5"><span className="text-blue-400 font-bold shrink-0 text-xs">{num}</span><span>{boldified}</span></div>;
            }
            return <span key={li}>{boldified}{li < part.split('\n').length - 1 ? '\n' : ''}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isAI ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-4 w-full ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <div className="w-9 h-9 rounded-xl bg-blue-900/30 border border-blue-900/20 flex items-center justify-center text-blue-400 shrink-0 shadow-sm shadow-blue-950/20">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl text-sm ${
          isAI
            ? 'bg-white/5 border border-white/10 text-slate-200 shadow-sm shadow-slate-950/10'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/40 border border-blue-500/20 font-semibold'
        }`}
      >
        {isAI ? (
          <div className="flex flex-col">
            <div className="p-4">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1 block">
                AI Tutor Coach
              </span>
              <div className="text-slate-200 text-xs md:text-sm">
                {formatText(displayedText)}
                {isTyping && <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-1 animate-pulse select-none align-middle">▮</span>}
              </div>
            </div>

            {/* RAG Source Citations */}
            {hasSources && (
              <div className="border-t border-white/10 px-4 pb-3 pt-2 bg-slate-900/10">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{message.sources!.length} Knowledge Source{message.sources!.length > 1 ? 's' : ''} Retrieved</span>
                  {showSources
                    ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                    : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                  }
                </button>

                {showSources && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {message.sources!.map((src) => (
                      <span
                        key={src.id}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-950/40 border border-indigo-900/30 text-[10px] font-bold text-indigo-400 animate-scale-in"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        {src.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-100 text-xs md:text-sm p-4 leading-relaxed">{message.text}</p>
        )}
      </div>

      {!isAI && (
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 shadow-sm shadow-slate-950/20">
          <User className="w-5 h-5" />
        </div>
      )}
    </motion.div>
  );
}
