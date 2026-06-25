'use client';

import { useState } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';
import { ChevronDown, Code, Check } from 'lucide-react';

export default function LanguageDropdown() {
  const { language, setLanguage, careerGoal } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const filteredLanguages = careerGoal === 'data-analyst'
    ? LANGUAGES.filter((l) => l.id === 'python' || l.id === 'r')
    : LANGUAGES;

  const handleSelect = (langId: string, isFuture?: boolean) => {
    if (isFuture) {
      alert(`${langId.toUpperCase()} path is coming soon! Try Python, JavaScript, Java, C++, or Go in this preview.`);
      return;
    }
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg text-slate-200 text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer shrink-0"
      >
        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeLang.color}`} />
        <span>{activeLang.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
 
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 glass-dropdown overflow-hidden transform origin-top-right transition-all duration-200">
            <div className="px-3.5 py-2.5 border-b border-white/5 bg-slate-900/50">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Select Learning Journey
              </span>
            </div>
            <div className="p-1 max-h-80 overflow-y-auto custom-scrollbar">
              {filteredLanguages.map((lang) => {
                const isActive = lang.id === language;
                return (
                  <button
                    key={lang.id}
                    onClick={() => handleSelect(lang.id, lang.isFuture)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative group cursor-pointer ${
                      isActive
                        ? 'bg-blue-950/40 text-blue-400'
                        : lang.isFuture
                        ? 'text-slate-500 hover:bg-white/5'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${lang.color} ${isActive ? 'scale-110 shadow-lg shadow-blue-500/50' : 'opacity-70 group-hover:opacity-100'}`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{lang.name}</span>
                        {lang.isFuture && (
                          <span className="text-[9px] font-medium text-amber-500/70 tracking-wide mt-0.5">
                            Roadmap coming soon
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isActive && (
                      <Check className="w-4 h-4 text-blue-400 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
