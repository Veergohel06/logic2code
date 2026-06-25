'use client';

import { useState } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { CAREER_TRACKS } from '@/config/careerRoadmaps';
import { ChevronDown, Briefcase, Check } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function CareerDropdown() {
  const { careerGoal, setCareerGoal, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeTrack = CAREER_TRACKS.find((t) => t.id === careerGoal) || CAREER_TRACKS[0];

  const handleSelect = (trackId: string) => {
    setCareerGoal(trackId);
    if (trackId === 'data-analyst' && language !== 'python' && language !== 'r') {
      setLanguage('python');
    }
    setIsOpen(false);
  };

  const renderIcon = (iconName: string, className = "w-4 h-4 text-slate-500") => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Briefcase className={className} />;
  };

  // If onboarding is not completed, don't show the dropdown (it will render after onboarding)
  if (!careerGoal) return null;

  return (
    <div className="relative z-50">
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg text-slate-200 text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer shrink-0"
      >
        <div className="flex items-center gap-1.5">
          {renderIcon(activeTrack.icon, "w-3.5 h-3.5 text-blue-400")}
          <span className="max-w-[100px] truncate">{activeTrack.name}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
 
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 glass-dropdown overflow-hidden transform origin-top-right transition-all duration-200">
            <div className="px-3.5 py-2.5 border-b border-white/5 bg-slate-900/50">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Select Career Track
              </span>
            </div>
            <div className="p-1 max-h-80 overflow-y-auto custom-scrollbar">
              {CAREER_TRACKS.map((track) => {
                const isActive = track.id === careerGoal;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelect(track.id)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative group cursor-pointer ${
                      isActive
                        ? 'bg-blue-950/40 text-blue-400'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-900/30 text-blue-400' : 'bg-white/5 text-slate-400 group-hover:bg-slate-200/50 dark:group-hover:bg-white/10'}`}>
                        {renderIcon(track.icon, "w-3.5 h-3.5")}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold truncate">{track.name}</span>
                        <span className="text-[9px] font-medium text-slate-500 truncate mt-0.5 max-w-[180px]">
                          {track.description}
                        </span>
                      </div>
                    </div>
                    
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-blue-400 stroke-[3] shrink-0" />
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
