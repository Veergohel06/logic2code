'use client';

import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  executingLine?: number;
  theme?: string;
}

export default function MonacoEditor({ value, onChange, executingLine, theme = 'premium-dark' }: MonacoEditorProps) {
  const { language } = useLanguage();
  const [editorLanguage, setEditorLanguage] = useState('python');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const decorationsRef = useRef<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeLang = LANGUAGES.find((l) => l.id === language);
    if (activeLang) {
      setEditorLanguage(activeLang.monacoLang);
    }
  }, [language]);

  useEffect(() => {
    if (!editorInstance) return;

    if (executingLine && executingLine > 0) {
      const newDecorations = editorInstance.deltaDecorations(decorationsRef.current, [
        {
          range: {
            startLineNumber: executingLine,
            startColumn: 1,
            endLineNumber: executingLine,
            endColumn: 1
          },
          options: {
            isWholeLine: true,
            className: 'bg-blue-500/15 border-l-3 border-blue-500/80 shadow-[inset_4px_0_0_0_#3b82f6]'
          }
        }
      ]);
      decorationsRef.current = newDecorations;
      editorInstance.revealLineInCenterIfOutsideViewport(executingLine);
    } else {
      if (decorationsRef.current.length > 0) {
        editorInstance.deltaDecorations(decorationsRef.current, []);
        decorationsRef.current = [];
      }
    }

    return () => {
      if (editorInstance && decorationsRef.current.length > 0) {
        editorInstance.deltaDecorations(decorationsRef.current, []);
      }
    };
  }, [executingLine, editorInstance]);

  useEffect(() => {
    if (monacoInstance && theme) {
      monacoInstance.editor.setTheme(theme);
    }
  }, [theme, monacoInstance]);

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Re-layout editor when fullscreen toggles
  useEffect(() => {
    if (editorInstance) {
      setTimeout(() => editorInstance.layout(), 50);
    }
  }, [isFullscreen, editorInstance]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
    
    // Define Slate Dark (VS Code-inspired premium dark theme)
    monaco.editor.defineTheme('premium-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'c792ea', fontStyle: 'bold' },
        { token: 'string', foreground: 'c3e88d' },
        { token: 'number', foreground: '82b1ff' },
        { token: 'regexp', foreground: 'ff5370' },
        { token: 'type', foreground: 'decb6b' },
        { token: 'class', foreground: 'ffcb6b', fontStyle: 'bold' },
        { token: 'class.identifier', foreground: 'ffcb6b', fontStyle: 'bold' },
        { token: 'function', foreground: '82b1ff', fontStyle: 'bold' },
        { token: 'function.call', foreground: '82b1ff' },
        { token: 'identifier', foreground: 'eeffff' },
        { token: 'variable', foreground: 'eeffff' },
        { token: 'variable.parameter', foreground: 'eeffff' },
        { token: 'operator', foreground: 'ffcb6b' },
        { token: 'delimiter', foreground: 'eeffff' },
      ],
      colors: {
        'editor.background': '#080b11',
        'editor.foreground': '#eeffff',
        'editor.lineHighlightBackground': '#1e293b40',
        'editor.lineHighlightBorder': '#3b82f640',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#3b82f6',
        'editor.selectionBackground': '#264f7860',
        'editor.inactiveSelectionBackground': '#264f7830',
        'editorGutter.background': '#080b11',
      }
    });

    // Define Cyberpunk (Neon glow theme)
    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '00F0FF', fontStyle: 'italic' }, // neon cyan comments
        { token: 'keyword', foreground: 'FF007F', fontStyle: 'bold' },    // neon pink keywords
        { token: 'keyword.control', foreground: 'FF007F', fontStyle: 'bold' },
        { token: 'string', foreground: '39FF14' },                       // neon green strings
        { token: 'number', foreground: 'FCEE09' },                       // cyberpunk yellow numbers
        { token: 'type', foreground: 'BD00FF' },                         // purple types
        { token: 'type.identifier', foreground: 'BD00FF' },
        { token: 'class', foreground: 'BD00FF', fontStyle: 'bold' },
        { token: 'class.identifier', foreground: 'BD00FF', fontStyle: 'bold' },
        { token: 'function', foreground: '00F0FF' },                     // neon cyan functions
        { token: 'function.call', foreground: '00F0FF' },
        { token: 'variable', foreground: 'FFFFFF' },
        { token: 'operator', foreground: 'FF007F' },                      // neon pink operators
        { token: 'delimiter', foreground: '00F0FF' },
      ],
      colors: {
        'editor.background': '#0E0416', // deep dark purple
        'editor.foreground': '#E0E0E0',
        'editor.lineHighlightBackground': '#1A0A2E',
        'editorLineNumber.foreground': '#4C2878',
        'editorLineNumber.activeForeground': '#FF007F',
        'editor.selectionBackground': '#FF007F33',
        'editor.inactiveSelectionBackground': '#FF007F1A',
        'editorGutter.background': '#0E0416',
      }
    });

    // Define GitHub Light (Minimal light theme)
    monaco.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'D73A49', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'D73A49', fontStyle: 'bold' },
        { token: 'string', foreground: '032F62' },
        { token: 'number', foreground: '005CC5' },
        { token: 'type', foreground: '6F42C1' },
        { token: 'type.identifier', foreground: '6F42C1' },
        { token: 'class', foreground: '6F42C1', fontStyle: 'bold' },
        { token: 'class.identifier', foreground: '6F42C1', fontStyle: 'bold' },
        { token: 'function', foreground: '005CC5' },
        { token: 'function.call', foreground: '005CC5' },
        { token: 'variable', foreground: '24292E' },
        { token: 'operator', foreground: 'D73A49' },
        { token: 'delimiter', foreground: '24292E' },
      ],
      colors: {
        'editor.background': '#F6F8FA', // github light grey
        'editor.foreground': '#24292E',
        'editor.lineHighlightBackground': '#F1F8FF',
        'editorLineNumber.foreground': '#959DA5',
        'editorLineNumber.activeForeground': '#24292E',
        'editor.selectionBackground': '#0366D625',
        'editor.inactiveSelectionBackground': '#0366D615',
        'editorGutter.background': '#F6F8FA',
      }
    });

    monaco.editor.setTheme(theme);
    setThemeLoaded(true);
  };

  const getThemeBg = () => {
    if (theme === 'cyberpunk') return 'bg-[#0E0416] text-[#E0E0E0] border-[#FF007F]/10';
    if (theme === 'github-light') return 'bg-[#F6F8FA] text-[#24292E] border-slate-200';
    return 'bg-[#080b11] text-[#eeffff] border-white/5';
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all duration-300 ${getThemeBg()} ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none h-screen'
          : 'h-[450px] rounded-2xl border'
      }`}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-slate-800/95 hover:bg-slate-700/95 border border-white/10 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer group"
        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Maximize Editor'}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        ) : (
          <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Fullscreen exit badge */}
      {isFullscreen && (
        <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/90 border border-blue-800/30 text-[10px] font-bold text-blue-300 select-none">
          Press <kbd className="px-1 py-0.5 rounded bg-blue-800/40 text-blue-200 font-mono text-[9px]">Esc</kbd> to exit fullscreen
        </div>
      )}

      <Editor
        height="100%"
        language={editorLanguage}
        theme={themeLoaded ? theme : 'vs-dark'}
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex flex-col items-center justify-center gap-3 w-full h-full bg-[#0B1120] text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs font-semibold">Loading Monaco Editor IntelliSense...</span>
          </div>
        }
        options={{
          fontSize: isFullscreen ? 16 : 14,
          fontFamily: "var(--font-mono), 'Fira Code', monospace",
          lineHeight: isFullscreen ? 26 : 22,
          minimap: { enabled: isFullscreen },
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          },
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          tabSize: 4
        }}
      />
    </div>
  );
}
