'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { CAREER_TRACKS } from '@/config/careerRoadmaps';
import { LANGUAGES } from '@/config/languages';
import { Save, User, UserCheck, Cpu, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const AVATARS = [
  { id: '1', emoji: '💻', name: 'Code Wizard', color: 'from-blue-500 to-indigo-500' },
  { id: '2', emoji: '🚀', name: 'Bug Hunter', color: 'from-emerald-500 to-teal-500' },
  { id: '3', emoji: '🤖', name: 'AI Architect', color: 'from-purple-500 to-indigo-500' },
  { id: '4', emoji: '👾', name: 'Cyber Ninja', color: 'from-rose-500 to-orange-500' },
  { id: '5', emoji: '🐹', name: 'Go Gopher', color: 'from-sky-400 to-blue-500' },
  { id: '6', emoji: '☕', name: 'Java Guru', color: 'from-amber-500 to-orange-600' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' }
];

export default function SettingsPage() {
  const { 
    displayName, setDisplayName, 
    avatarId, setAvatarId, 
    language, setLanguage, 
    careerGoal, setCareerGoal, 
    experienceLevel, setExperienceLevel 
  } = useLanguage();

  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const [langSelect, setLangSelect] = useState('python');
  const [careerSelect, setCareerSelect] = useState('');
  const [levelSelect, setLevelSelect] = useState('beginner');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state on load
  useEffect(() => {
    setNameInput(displayName || '');
    setSelectedAvatar(avatarId || '1');
    setLangSelect(language || 'python');
    setCareerSelect(careerGoal || 'full-stack');
    setLevelSelect(experienceLevel || 'beginner');
  }, [displayName, avatarId, language, careerGoal, experienceLevel]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      // Set values globally through store/hooks
      await setDisplayName(nameInput.trim());
      await setAvatarId(selectedAvatar);
      await setLanguage(langSelect);
      await setCareerGoal(careerSelect);
      await setExperienceLevel(levelSelect);

      // Trigger visual indicator
      setSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const activeAvatar = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div className="flex-grow flex flex-col gap-6 py-2 max-w-4xl mx-auto w-full page-transition">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/10 pb-5 animate-slide-up">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-[0.18em] bg-indigo-950/40 border border-indigo-800/30 px-2.5 py-1 rounded-full">
            <User className="w-2.5 h-2.5" />
            Profile Preferences
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-slate-400 font-semibold max-w-md mt-1">
          Customize your nickname, coding avatar, language preference, and learning roadmap specifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Left Side: Avatar Display & Selector */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="glass-spatial rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden group premium-glow-card">
            {/* Shifting radial background */}
            <div className={`absolute -top-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-br ${activeAvatar.color} opacity-10 blur-2xl animate-float-slow`} />

            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${activeAvatar.color} flex items-center justify-center text-5xl shadow-lg shadow-black/30 border border-white/15 mb-4 group-hover:scale-105 transition-transform duration-300`}>
              {activeAvatar.emoji}
            </div>

            <h2 className="text-base font-extrabold text-white mb-1">
              {nameInput.trim() || 'Anonymous Developer'}
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full mb-6">
              {activeAvatar.name}
            </span>

            <div className="w-full text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                Select Avatar
              </span>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    title={av.name}
                    className={`h-12 rounded-xl flex items-center justify-center text-2xl border transition-all cursor-pointer ${
                      selectedAvatar === av.id
                        ? `bg-slate-900 border-blue-500/70 shadow shadow-blue-500/10 scale-102`
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-spatial rounded-3xl p-6 flex flex-col gap-5 premium-glow-card">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Profile Details
            </span>

            {/* Display Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-xs font-bold text-slate-300">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value.slice(0, 25))}
                placeholder="CoderNickname"
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all placeholder:text-slate-500 leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preferred Language */}
              <div className="flex flex-col gap-2">
                <label htmlFor="language" className="text-xs font-bold text-slate-300">
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={langSelect}
                    onChange={(e) => setLangSelect(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    {LANGUAGES.filter(l => !l.isFuture).map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Experience Level */}
              <div className="flex flex-col gap-2">
                <label htmlFor="expLevel" className="text-xs font-bold text-slate-300">
                  Experience Level
                </label>
                <select
                  id="expLevel"
                  value={levelSelect}
                  onChange={(e) => setLevelSelect(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Career Track Goal */}
            <div className="flex flex-col gap-2">
              <label htmlFor="careerGoal" className="text-xs font-bold text-slate-300">
                Career Track Goal
              </label>
              <select
                id="careerGoal"
                value={careerSelect}
                onChange={(e) => setCareerSelect(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {CAREER_TRACKS.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
              <div>
                {success && (
                  <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1 animate-glow-pulse">
                    <Sparkles className="w-4 h-4" />
                    Profile saved successfully!
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer btn-shine"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                ) : (
                  <Save className="w-4 h-4 shrink-0" />
                )}
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
