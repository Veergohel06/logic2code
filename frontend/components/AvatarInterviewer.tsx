'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AvatarInterviewerProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export default function AvatarInterviewer({ isSpeaking, isListening }: AvatarInterviewerProps) {
  const [mouthOpen, setMouthOpen] = useState(false);

  // Simulated lip movement using CSS transforms changing state every 150ms when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(false);
      return;
    }

    const interval = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 150);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Eyelid blink animation configurations (Blinks every 5 seconds)
  const blinkTransition = {
    repeat: Infinity,
    duration: 5,
    times: [0, 0.95, 0.97, 0.99, 1],
  };

  return (
    <div className="glass-spatial rounded-2xl p-5 border border-white/10 bg-slate-950/60 shadow-lg shadow-black/20 flex-grow flex flex-col items-center justify-between select-none min-h-[280px]">
      {/* Title & Status Badge Header */}
      <div className="w-full flex items-center justify-between border-b border-white/5 pb-2.5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
          AI Interviewer
        </span>
        
        {/* Dynamic Recruiter Status Badge */}
        {isSpeaking ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">SPEAKING</span>
            <div className="flex items-end gap-[1.5px] h-2.5 pb-[1px]">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="w-[1.5px] bg-purple-400 rounded-full"
                  animate={{ height: [2, 8, 3, 9, 2][(i + (mouthOpen ? 1 : 0)) % 5] }}
                  transition={{ duration: 0.15 }}
                  style={{ height: '3px' }}
                />
              ))}
            </div>
          </div>
        ) : isListening ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">LISTENING</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/10 border border-white/5 text-slate-400">
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">IDLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
        )}
      </div>

      {/* Centered Avatar Box with Glowing Neon Rings */}
      <div className="relative w-32 h-32 my-4 flex items-center justify-center">
        {/* Glowing ring under Speaking state */}
        {isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-purple-500/35 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-purple-500/20 shadow-[0_0_25px_rgba(168,85,247,0.15)]"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Glowing ring under Listening state */}
        {isListening && (
          <motion.div
            className="absolute -inset-1 rounded-full border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.25)] animate-pulse"
          />
        )}

        {/* Main Avatar Container with breathing animation */}
        <motion.div 
          className="w-28 h-28 rounded-full overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center relative shadow-inner"
          animate={{
            y: [0, -1.5, 0],
            scale: isSpeaking ? [1, 1.02, 1] : 1
          }}
          transition={{
            y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
        >
          {/* Static Face Image */}
          <img 
            src="/avatar/sarah-johnson.png" 
            alt="Sarah Johnson" 
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Lip Movement Overlay: morphs and scales every 150ms using CSS transforms */}
          {isSpeaking && (
            <div 
              className="absolute w-5 h-2.5 bg-[#b91c1c] rounded-full border border-red-800 transition-transform duration-150 shadow-sm"
              style={{
                top: '59%',
                left: 'calc(50% - 10px)',
                transformOrigin: 'center',
                transform: mouthOpen ? 'scaleY(1.6) scaleX(0.9)' : 'scaleY(0.7) scaleX(1.1)'
              }}
            />
          )}

          {/* Automatic Eyelid Blinking Overlays (Closes eyes briefly every 5s) */}
          <motion.div
            className="absolute bg-[#e9aa94] w-3 h-1.5 rounded-full"
            style={{ top: '45.5%', left: '32.5%', transformOrigin: 'top' }}
            animate={{ scaleY: [0, 0, 1, 0, 0] }}
            transition={blinkTransition}
          />
          <motion.div
            className="absolute bg-[#e9aa94] w-3 h-1.5 rounded-full"
            style={{ top: '45.5%', right: '32.5%', transformOrigin: 'top' }}
            animate={{ scaleY: [0, 0, 1, 0, 0] }}
            transition={blinkTransition}
          />
        </motion.div>
      </div>

      {/* Speaking Waveform beneath Avatar */}
      <div className="h-6 flex items-center justify-center">
        {isSpeaking ? (
          <div className="flex items-end gap-1 h-3 select-none">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <motion.div
                key={i}
                className="w-[2.5px] bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full"
                animate={{ height: mouthOpen ? [3, 12, 5, 14, 4, 10, 3][i % 7] : [2, 4, 2, 5, 2, 4, 2][i % 7] }}
                transition={{ duration: 0.15 }}
                style={{ height: '3px' }}
              />
            ))}
          </div>
        ) : isListening ? (
          <span className="text-[9px] font-bold text-emerald-400 tracking-widest font-mono animate-pulse">
            AWAITING INPUT
          </span>
        ) : (
          <span className="text-[9px] font-bold text-slate-500 tracking-widest font-mono">
            STANDBY
          </span>
        )}
      </div>

      {/* Recruiter Identity Labels */}
      <div className="w-full text-center border-t border-white/5 pt-2.5 mt-1 select-none">
        <h4 className="text-xs font-black text-white tracking-wide uppercase">
          Sarah Johnson
        </h4>
        <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">
          Senior Engineering Manager
        </p>
      </div>
    </div>
  );
}
