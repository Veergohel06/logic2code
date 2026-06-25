'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { Sparkles, X, ChevronRight, Check, RefreshCw, Loader2, BookOpen } from 'lucide-react';

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeTitle: string;
}

export default function FlashcardModal({ isOpen, onClose, nodeId, nodeTitle }: FlashcardModalProps) {
  const { careerGoal, language } = useLanguage();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (isOpen && nodeId) {
      setLoading(true);
      setCurrentIdx(0);
      setIsFlipped(false);
      setMasteredCount(0);
      setFinished(false);

      fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, careerGoal, language })
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setCards(data.flashcards || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, nodeId, careerGoal, language]);

  if (!isOpen) return null;

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      setMasteredCount(prev => prev + 1);
    }

    setIsFlipped(false);

    // Delay index change slightly to allow card to flip back first
    setTimeout(() => {
      if (currentIdx + 1 < cards.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setFinished(true);
      }
    }, 150);
  };

  const activeCard = cards[currentIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[480px] animate-fade-in glass-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-blue-400" />
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-sans">Active Recall Cards</span>
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
                Loading Flashcards
              </span>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Structuring key concepts for active recall review...
              </p>
            </div>
          ) : finished ? (
            /* Complete view */
            <div className="flex-grow flex flex-col items-center justify-center text-center gap-5 py-4">
              <div className="w-14 h-14 rounded-full bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-blue-400 mb-1">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Practice Complete</span>
                <h3 className="text-lg font-black text-white">Mastery Session Done</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  You marked <strong className="text-white">{masteredCount} out of {cards.length}</strong> concepts as mastered.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Done studying
              </button>
            </div>
          ) : activeCard ? (
            /* Card view */
            <div className="flex flex-col gap-6 flex-grow justify-between">
              {/* Counter */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider">
                <span>Card {currentIdx + 1} of {cards.length}</span>
                <span>Mastered: {masteredCount}</span>
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative w-full h-[220px] cursor-pointer select-none"
                style={{ perspective: '1000px' }}
              >
                <div
                  className="w-full h-full duration-500 transition-transform relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'none'
                  }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center bg-slate-900 shadow-sm"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Prompt</span>
                    <p className="text-xs font-black text-white text-center leading-relaxed max-w-xs">{activeCard.front}</p>
                    <span className="text-[9px] text-indigo-400 font-bold mt-5 uppercase tracking-wider flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Click to Flip
                    </span>
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center bg-slate-950/60 shadow-sm"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest block mb-2">Key Concept</span>
                    <p className="text-[11px] font-semibold text-slate-200 text-center leading-relaxed max-w-xs">{activeCard.back}</p>
                    <span className="text-[9px] text-indigo-400 font-bold mt-5 uppercase tracking-wider flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Flip Back
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleNext(false)}
                  className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Still learning
                </button>
                <button
                  onClick={() => handleNext(true)}
                  className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
                >
                  Mastered
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Failed to load flashcards.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
