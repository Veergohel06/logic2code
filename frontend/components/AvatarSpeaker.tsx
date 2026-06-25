'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AvatarSpeakerProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export default function AvatarSpeaker({ isSpeaking, isListening }: AvatarSpeakerProps) {
  // Eye blink cycle: natural blinking
  const blinkTransition = {
    repeat: Infinity,
    duration: 3.5,
    ease: "easeInOut" as const,
    times: [0, 0.96, 0.98, 1],
  };

  // Breathing movement
  const breatheAnimation = {
    y: [0, -1.5, 0],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "easeInOut" as const
    }
  };

  // Subtle head movements
  const headBobAnimation = {
    y: [0, -1, 0],
    rotate: [0, 0.4, -0.4, 0],
    transition: {
      repeat: Infinity,
      duration: 5,
      ease: "easeInOut" as const
    }
  };

  // Lip-sync shape shifting when speaking
  const mouthPathAnimation = isSpeaking 
    ? {
        d: [
          "M 90 115 Q 100 125 110 115", // open a bit
          "M 93 113 Q 100 119 107 113", // close a bit
          "M 88 116 Q 100 132 112 116", // wide open
          "M 92 114 Q 100 120 108 114", // smile small
          "M 90 115 Q 100 128 110 115"  // loop
        ],
        transition: {
          duration: 0.45,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      }
    : {
        d: "M 90 115 Q 100 122 110 115" // neutral smile
      };

  return (
    <div className="glass-spatial rounded-2xl p-4 border border-white/10 bg-slate-950/60 shadow-lg shadow-black/20 flex-grow flex flex-col items-center justify-between select-none min-h-[260px]">
      <div className="w-full flex items-center justify-between border-b border-white/5 pb-2.5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
          AI Interviewer
        </span>
        
        {/* Dynamic Status Badge */}
        {isSpeaking ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">SPEAKING</span>
            <div className="flex items-end gap-[1.5px] h-2 pb-[1px]">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="w-[1.5px] bg-purple-400 rounded-full"
                  animate={{ height: [2, 7, 3, 8, 2][i % 5] }}
                  transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.08 }}
                  style={{ height: '3px' }}
                />
              ))}
            </div>
          </div>
        ) : isListening ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">LISTENING</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/10 border border-white/5 text-slate-400">
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">IDLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
        )}
      </div>

      {/* Avatar Container with Glowing Outer Rings */}
      <div className="relative w-28 h-28 my-3 flex items-center justify-center">
        {/* Pulse ring for Speaking status */}
        {isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.4, ease: "easeOut" }}
            />
          </>
        )}
        
        {/* Glow border for listening */}
        {isListening && (
          <motion.div
            className="absolute -inset-1 rounded-full border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)] animate-pulse"
          />
        )}

        {/* The SVG Recruiter Face */}
        <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center relative shadow-inner">
          <svg viewBox="0 0 200 200" className="w-full h-full select-none">
            <defs>
              <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffdcc8" />
                <stop offset="100%" stopColor="#f3b49f" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a2e2b" />
                <stop offset="100%" stopColor="#251615" />
              </linearGradient>
            </defs>

            {/* Backdrop Circle */}
            <circle cx="100" cy="100" r="100" fill="url(#bgGrad)" />

            {/* Breathing Body Group */}
            <motion.g animate={breatheAnimation}>
              {/* Shoulders / Formal Blazer (Navy/Slate) */}
              <path d="M 40 180 C 40 155, 70 145, 100 145 C 130 145, 160 155, 160 180 Z" fill="#1e293b" />
              
              {/* Inner blouse (White/Lavender) */}
              <path d="M 85 145 L 100 170 L 115 145 Z" fill="#f8fafc" />
              <path d="M 85 145 L 100 178 L 115 145 Z" fill="#e2e8f0" />

              {/* Blazer Collars */}
              <path d="M 50 180 L 85 145 L 92 165 Z" fill="#334155" />
              <path d="M 150 180 L 115 145 L 108 165 Z" fill="#334155" />
            </motion.g>

            {/* Neck */}
            <rect x="90" y="120" width="20" height="30" rx="3" fill="url(#skinGrad)" />
            <path d="M 90 135 Q 100 145 110 135 Z" fill="#e59885" opacity="0.35" />

            {/* Bobbing Head / Face Group */}
            <motion.g animate={headBobAnimation}>
              {/* Hair Back */}
              <path d="M 60 70 C 50 100, 50 130, 60 140 C 65 140, 75 110, 75 100 Z" fill="url(#hairGrad)" />
              <path d="M 140 70 C 150 100, 150 130, 140 140 C 135 140, 125 110, 125 100 Z" fill="url(#hairGrad)" />

              {/* Face Shape */}
              <path d="M 68 85 C 68 60, 132 60, 132 85 C 132 118, 122 135, 100 135 C 78 135, 68 118, 68 85 Z" fill="url(#skinGrad)" />

              {/* Sleek Hair Front / Bangs */}
              <path d="M 62 80 C 62 50, 138 50, 138 80 C 138 55, 125 45, 100 45 C 75 45, 62 55, 62 80 Z" fill="url(#hairGrad)" />
              <path d="M 62 76 C 68 62, 90 55, 96 68 C 96 68, 78 65, 68 80 Z" fill="#653f3a" />
              <path d="M 138 76 C 132 62, 110 55, 104 68 C 104 68, 122 65, 132 80 Z" fill="#653f3a" />

              {/* Nose */}
              <path d="M 98 96 Q 100 102 102 96" stroke="#d47963" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              {/* Blinking Eyes */}
              {/* Left Eye */}
              <motion.g animate={{ scaleY: [1, 1, 1, 0.05, 1, 1, 1] }} transition={blinkTransition}>
                <ellipse cx="86" cy="85" rx="5.5" ry="3.5" fill="#ffffff" />
                <circle cx="86" cy="85" r="2.2" fill="#3b2314" />
                <circle cx="87" cy="84" r="0.8" fill="#ffffff" />
              </motion.g>
              {/* Eye contours */}
              <path d="M 80 84 Q 86 81 92 84" stroke="#4a2e2b" strokeWidth="1.2" fill="none" />

              {/* Right Eye */}
              <motion.g animate={{ scaleY: [1, 1, 1, 0.05, 1, 1, 1] }} transition={blinkTransition}>
                <ellipse cx="114" cy="85" rx="5.5" ry="3.5" fill="#ffffff" />
                <circle cx="114" cy="85" r="2.2" fill="#3b2314" />
                <circle cx="115" cy="84" r="0.8" fill="#ffffff" />
              </motion.g>
              {/* Eye contours */}
              <path d="M 108 84 Q 114 81 120 84" stroke="#4a2e2b" strokeWidth="1.2" fill="none" />

              {/* Eyebrows */}
              <path d="M 79 77 Q 86 73 93 78" stroke="#251615" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M 107 77 Q 114 73 121 78" stroke="#251615" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              {/* Cheek blush */}
              <circle cx="76" cy="98" r="4.5" fill="#fca5a5" opacity="0.3" filter="blur(1px)" />
              <circle cx="124" cy="98" r="4.5" fill="#fca5a5" opacity="0.3" filter="blur(1px)" />

              {/* Animated Speaking Mouth */}
              <motion.path 
                animate={mouthPathAnimation}
                stroke="#b91c1c" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round" 
              />
            </motion.g>
          </svg>
        </div>
      </div>

      {/* Recruiter Meta Details */}
      <div className="w-full text-center border-t border-white/5 pt-2.5 mt-2">
        <h4 className="text-xs font-black text-white tracking-wide">
          Sarah Johnson
        </h4>
        <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
          Senior Engineering Manager
        </p>
      </div>
    </div>
  );
}
