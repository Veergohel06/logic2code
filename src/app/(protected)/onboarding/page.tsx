'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { useProgress } from '@/frontend/hooks/useProgress';
import { CAREER_TRACKS, EXPERIENCE_LEVELS } from '@/config/careerRoadmaps';
import { LANGUAGES } from '@/config/languages';
import * as Icons from 'lucide-react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Terminal, Compass, Zap } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { setCareerGoal, setExperienceLevel, setLanguage } = useLanguage();
  const { resetProgress } = useProgress();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLang, setSelectedLang] = useState('');

  // Dynamically resolve icon component from string
  const renderIcon = (iconName: string, className = "w-6 h-6 text-slate-500") => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Icons.HelpCircle className={className} />;
  };

  const handleNext = () => {
    if (step === 1 && selectedGoal) {
      setStep(2);
    } else if (step === 2 && selectedLevel) {
      setStep(3);
    } else if (step === 3 && selectedLang) {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    // Save selections
    await setCareerGoal(selectedGoal);
    await setExperienceLevel(selectedLevel);
    await setLanguage(selectedLang);
    
    // Reset progress metrics strictly to 0
    await resetProgress();

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const isNextDisabled = () => {
    if (step === 1) return !selectedGoal;
    if (step === 2) return !selectedLevel;
    if (step === 3) return !selectedLang;
    return true;
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-between pt-12 pb-6 max-w-5xl mx-auto w-full px-4">
      {/* Top Progress bar */}
      <div className="w-full flex items-center justify-between mb-8 select-none">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1 flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === num
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-spatial-glow-blue/30 scale-105'
                    : step > num
                    ? 'bg-emerald-500 text-white shadow-spatial-glow-emerald/30'
                    : 'bg-slate-800 text-slate-450 border border-white/5'
                }`}
              >
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
              <span
                className={`text-xs tracking-tight hidden sm:inline ${
                  step === num
                    ? 'text-white font-extrabold'
                    : step > num
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-500 font-semibold'
                }`}
              >
                {num === 1 && 'Career Goal'}
                {num === 2 && 'Experience'}
                {num === 3 && 'Programming Language'}
              </span>
            </div>
            {num < 3 && (
              <div
                className={`flex-grow h-1 mx-4 rounded-full transition-all duration-500 ${
                  step > num ? 'bg-emerald-500 shadow-spatial-glow-emerald/20' : 'bg-slate-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main wizard cards container */}
      <div className="flex-grow flex items-center justify-center my-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="text-center max-w-xl mx-auto mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  What is your career goal? 🎯
                </h1>
                <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                  Select a specialization track. We will tailor your entire learning roadmap, mock interview questions, and capstone projects.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAREER_TRACKS.map((track) => {
                  const isSelected = selectedGoal === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => setSelectedGoal(track.id)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group relative overflow-hidden spatial-3d-card ${
                        isSelected
                          ? 'border-blue-500/50 bg-blue-950/40 shadow-spatial-glow-blue/10 scale-[1.02]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 hover:scale-[1.01]'
                      }`}
                    >
                      {/* Window Controls Dot */}
                      <div className="flex items-center gap-1 select-none opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 group-hover:bg-white/10'
                        }`}
                      >
                        {renderIcon(track.icon, isSelected ? 'w-5 h-5 text-white' : 'w-5 h-5 text-slate-400')}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm tracking-tight mb-1">
                          {track.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold leading-normal">
                          {track.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="text-center max-w-xl mx-auto mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Select your experience level 🚀
                </h1>
                <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                  We will calibrate the complexity of coding tasks, system design puzzles, and advisor suggestions.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {EXPERIENCE_LEVELS.map((level) => {
                  const isSelected = selectedLevel === level.id;
                  let levelIcon = <Compass className="w-5 h-5" />;
                  if (level.id === 'intermediate') levelIcon = <Terminal className="w-5 h-5" />;
                  if (level.id === 'advanced') levelIcon = <Zap className="w-5 h-5" />;

                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group relative spatial-3d-card ${
                        isSelected
                          ? 'border-blue-500/50 bg-blue-950/40 shadow-spatial-glow-blue/10 scale-[1.02]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 hover:scale-[1.01]'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 group-hover:bg-white/10'
                        }`}
                      >
                        {levelIcon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-extrabold text-white text-sm tracking-tight mb-1">
                          {level.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold leading-normal">
                          {level.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="text-center max-w-xl mx-auto mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Choose your programming language 💻
                </h1>
                <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                  Pick the language you want to build this career track in. You can change this language at any time from your settings or dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const availableLangs = selectedGoal === 'data-analyst'
                    ? LANGUAGES.filter((l) => l.id === 'python' || l.id === 'r')
                    : LANGUAGES;
                  return availableLangs.map((lang) => {
                    const isSelected = selectedLang === lang.id;
                    const isLocked = lang.isFuture;

                    return (
                      <button
                        key={lang.id}
                        disabled={isLocked}
                        onClick={() => !isLocked && setSelectedLang(lang.id)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group relative spatial-3d-card ${
                          isLocked
                            ? 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'border-blue-500/50 bg-blue-950/40 shadow-spatial-glow-blue/10 scale-[1.02]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              isLocked
                                ? 'bg-white/5 border-white/10 text-slate-500'
                                : isSelected
                                ? 'bg-blue-950/40 border-blue-900/30 text-blue-455'
                                : 'bg-white/5 border-white/10 text-slate-400'
                            }`}
                          >
                            {isLocked ? 'Coming Soon' : 'Active'}
                          </span>
                          {isSelected && !isLocked && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-sm tracking-tight mb-1 flex items-center gap-1.5">
                            {lang.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold leading-normal">
                            {lang.description}
                          </p>
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Nav Bar */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between select-none">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 bg-white/5 text-slate-300 transition-all ${
            step === 1
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-white/10 hover:text-white active:scale-98'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all bg-blue-600 ${
            isNextDisabled()
              ? 'opacity-50 cursor-not-allowed bg-blue-600/60'
              : 'hover:bg-blue-700 active:scale-98 hover:shadow-md hover:shadow-blue-500/10'
          }`}
        >
          <span>{step === 3 ? 'Generate My Roadmap ✨' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
