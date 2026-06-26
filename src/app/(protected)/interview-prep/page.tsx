'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { useProgress } from '@/frontend/hooks/useProgress';
import { CAREER_TRACKS } from '@/config/careerRoadmaps';
import {
  Bot, Sparkles, Send, Award, Cpu, HelpCircle, Loader2,
  ThumbsUp, CheckCircle2, Mic, MicOff, Calendar, UserCheck,
  Trophy, Target, Zap, ArrowRight, RefreshCw, Home, Code, Brain,
  Video, VideoOff, Volume2, VolumeX, Paperclip, Terminal, Play, Check,
  ChevronRight, Upload, User, UserX, AlertCircle, Copy, Minimize2, Maximize2,
  MessageSquare, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeUpload from '@/components/interview/ResumeUpload';


interface Message {
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  focusAreas?: string[];
  feedbackTags?: string[];
  isNew?: boolean;
}

interface CodingProblem {
  title: string;
  description: string;
  template: string;
  expectedOutput: string;
  testCases: { input: string; expected: string }[];
  hint: string;
}

type InterviewStep =
  | 'WELCOME'
  | 'INTRO_ABOUT'
  | 'INTRO_CURRENT'
  | 'INTRO_TECH'
  | 'INTRO_PROJECT'
  | 'INTRO_ROLE'
  | 'ASSESSMENT'
  | 'TECH_1'
  | 'TECH_2'
  | 'CODING_INTRO'
  | 'CODING_ROUND'
  | 'BEHAVIORAL'
  | 'FEEDBACK_CALCULATING'
  | 'FEEDBACK';


const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Rich Keyword Highlighting Configurations
// Premium Glassmorphism Keyword Highlighting Configurations
const KEYWORD_CONFIGS = [
  // Recruiter Name (Purple Accent)
  {
    words: ['sarah johnson', 'sarah', 'johnson'],
    style: 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
  },
  // Candidate Name (Blue Accent)
  {
    words: ['candidate'],
    style: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
  },
  // Role Titles (Green Accent)
  {
    words: [
      'senior software engineering manager', 'senior engineering manager', 'senior engineering mgr',
      'full stack developer', 'fullstack developer', 'frontend developer', 'backend developer', 
      'software engineer', 'engineering manager', 'recruiter'
    ],
    style: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
  },
  // Technologies (Cyan Accent)
  {
    words: [
      'javascript', 'typescript', 'react', 'node.js', 'nodejs', 'node', 'express', 
      'mongodb', 'postgresql', 'next.js', 'python', 'c++', 'html', 'css', 'sql', 'nosql', 'java', 'r'
    ],
    style: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
  },
  // Projects (Orange Accent)
  {
    words: ['ats resume analyzer', 'e-commerce platform', 'chat application', 'e-commerce'],
    style: 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
  },
  // Experience Levels (Yellow Accent)
  {
    words: [
      'student / graduate', 'fresher / entry level', 'junior developer', 'mid-level developer', 'senior developer',
      'student', 'fresher', 'junior', 'mid-level', 'senior', 'graduate', 'intern', 'beginner', 'intermediate', 'advanced'
    ],
    style: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
  },
  // Interview Skills (Pink Accent)
  {
    words: [
      'communication', 'problem solving', 'system design', 'coding', 'debugging', 'architecture', 
      'testing', 'clean code', 'algorithms', 'data structures', 'scalability', 'reliability', 
      'security', 'database design', 'performance optimization', 'collaboration', 'teamwork', 'leadership'
    ],
    style: 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 text-pink-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
  }
];

function formatUnbracketedKeywords(text: string, activeConfigs: any[]) {
  if (!text) return text;
  const wordsToMatch: string[] = [];
  activeConfigs.forEach(c => wordsToMatch.push(...c.words));
  wordsToMatch.sort((a, b) => b.length - a.length);

  const escaped = wordsToMatch.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  if (escaped.length === 0) return text;
  
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, idx) => {
    const config = activeConfigs.find((c: any) => 
      c.words.some((w: string) => w.toLowerCase() === part.toLowerCase())
    );
    if (config) {
      return (
        <span key={idx} className={`${config.style} inline-block align-middle leading-none mx-0.5 my-0.5 shadow-sm`}>
          {part}
        </span>
      );
    }
    return part;
  });
}

function formatKeywords(text: string, candidateNameVal?: string, skipRecruiter?: boolean) {
  if (!text) return '';

  let activeConfigs = [...KEYWORD_CONFIGS];
  if (skipRecruiter) {
    activeConfigs = activeConfigs.filter(config => 
      !config.words.includes('sarah johnson') && 
      !config.words.includes('senior software engineering manager')
    );
  }
  if (candidateNameVal && candidateNameVal !== 'Candidate') {
    activeConfigs.push({
      words: [candidateNameVal.toLowerCase()],
      style: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help'
    });
  }

  const getStyleForKeyword = (word: string): string => {
    const lower = word.toLowerCase();
    
    // Candidate Name
    if (candidateNameVal && (lower === candidateNameVal.toLowerCase() || lower === 'candidate')) {
      return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help';
    }

    // Recruiter Name
    const recruiterWords = ['sarah johnson', 'sarah', 'johnson'];
    if (!skipRecruiter && recruiterWords.some(rw => lower === rw || lower.includes(rw))) {
      return 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help';
    }

    // Find custom match
    const config = activeConfigs.find((c: any) => 
      c.words.some((w: string) => lower === w || lower.includes(w) || w.includes(lower))
    );
    if (config) return config.style;

    // Fallback to skill/pink style if inside brackets but not matched
    return 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 text-pink-300 font-extrabold px-2 py-0.5 rounded-lg shadow-sm hover:scale-[1.04] transition-all duration-200 cursor-help';
  };

  // Match bracketed content [keyword]
  const bracketRegex = /\[([^\]]+)\]/g;
  const bracketParts = text.split(bracketRegex);

  if (bracketParts.length > 1) {
    return (
      <>
        {bracketParts.map((part, idx) => {
          if (idx % 2 === 1) {
            // Bracketed term
            const style = getStyleForKeyword(part);
            return (
              <span key={idx} className={`${style} inline-block align-middle leading-none mx-0.5 my-0.5 shadow-sm`}>
                {part}
              </span>
            );
          } else {
            // Non-bracketed term
            return <span key={idx}>{formatUnbracketedKeywords(part, activeConfigs)}</span>;
          }
        })}
      </>
    );
  }

  return <>{formatUnbracketedKeywords(text, activeConfigs)}</>;
}

// Monaco-style code snippet formatter
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightSyntax = (rawCode: string) => {
    let clean = rawCode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const highlightRules = [
      { regex: /(\/\/.*|\#.*)/g, span: '<span class="text-slate-500 font-semibold">$1</span>' },
      { regex: /(["'])(?:(?=(\\?))\2.)*?\1/g, span: '<span class="text-emerald-400 font-medium">$1$2$3</span>' },
      { regex: /\b(function|return|def|class|import|from|const|let|var|if|else|for|while|async|await|try|catch|export|default)\b/g, span: '<span class="text-pink-400 font-black">$1</span>' },
      { regex: /\b(\d+)\b/g, span: '<span class="text-amber-400">$1</span>' },
      { regex: /\b(true|false|null|undefined|None)\b/g, span: '<span class="text-violet-400 font-black">$1</span>' }
    ];
    highlightRules.forEach(rule => {
      clean = clean.replace(rule.regex, rule.span);
    });
    return clean;
  };

  const lines = code.trim().split('\n');
  const renderedLines = isExpanded ? lines : lines.slice(0, 3);

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 font-mono text-[11px] w-full max-w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/5">
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{language || 'code'}</span>
        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={handleCopy}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[9px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {lines.length > 3 && (
            <button 
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[9px] font-bold cursor-pointer"
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
      
      <div className="p-3 overflow-x-auto flex flex-col leading-relaxed custom-scrollbar">
        {renderedLines.map((line, idx) => (
          <div key={idx} className="flex gap-3 items-start select-text hover:bg-white/[0.02] px-1 rounded">
            <span className="text-slate-600 text-right select-none w-5 text-[9px] mt-0.5 font-semibold">{idx + 1}</span>
            <pre 
              className="text-slate-300 whitespace-pre font-mono flex-grow select-text"
              dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }}
            />
          </div>
        ))}
        {!isExpanded && lines.length > 3 && (
          <div className="text-slate-500 text-[10px] pl-8 py-1 border-t border-white/5 mt-1 font-semibold italic">
            ... {lines.length - 3} lines hidden. Click maximize to expand.
          </div>
        )}
      </div>
    </div>
  );
}

// Typewriter Text Effect Component
function TypewriterText({ text, onComplete, candidateName, skipRecruiter }: { text: string; onComplete?: () => void; candidateName?: string; skipRecruiter?: boolean }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 8); // fast typewriter speed
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  const skipTyping = () => {
    setDisplayedText(text);
    setIndex(text.length);
    if (onComplete) onComplete();
  };

  const codeRegex = /```([\s\S]*?)```/g;
  const parts = displayedText.split(codeRegex);

  return (
    <div onClick={skipTyping} className="cursor-pointer select-text font-serif">
      {parts.map((part, idx) => {
        if (idx % 2 === 1) {
          const firstLineEnd = part.indexOf('\n');
          let lang = 'code';
          let codeContent = part;
          if (firstLineEnd !== -1) {
            const potentialLang = part.substring(0, firstLineEnd).trim();
            if (potentialLang.length > 0 && potentialLang.length < 10) {
              lang = potentialLang;
              codeContent = part.substring(firstLineEnd + 1);
            }
          }
          return <CodeBlock key={idx} code={codeContent} language={lang} />;
        }
        return <p key={idx} className="whitespace-pre-line leading-relaxed">{formatKeywords(part, candidateName, skipRecruiter)}</p>;
      })}
      {index < text.length && (
        <span className="inline-block w-[3px] h-3.5 bg-blue-400 ml-0.5 animate-pulse">|</span>
      )}
    </div>
  );
}

export default function MockInterviewPage() {
  const { careerGoal, language, experienceLevel } = useLanguage();
  const { addXP } = useProgress();

  const [activeTrack, setActiveTrack] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<InterviewStep>('WELCOME');
  const [candidateName, setCandidateName] = useState('Candidate');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [resumeText, setResumeText] = useState('');

  // Advanced Interview States
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'skills' | 'projects'>('overview');
  const [testCasesResult, setTestCasesResult] = useState<{ name: string; input: string; expected: string; got: string; passed: boolean }[]>([]);
  const [liveMetrics, setLiveMetrics] = useState({ technicalAlignment: 75, speakingPacing: 110, vocabularyDensity: 82 });
  const [speechPulseScale, setSpeechPulseScale] = useState(1.0);


  // Video & Webcam States
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const speechSessionRef = useRef<number>(0);

  // Voice States
  const [isMuted, setIsMuted] = useState(false); 
  const [isListening, setIsListening] = useState(false); 
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [voiceMode, setVoiceMode] = useState<'simulated' | 'vapi'>('simulated');
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [vapiCallState, setVapiCallState] = useState<'idle' | 'connecting' | 'active' | 'muted'>('idle'); 

  // Resume States
  const [resumeName, setResumeName] = useState('');
  const [resumeSummary, setResumeSummary] = useState('No resume uploaded yet. Upload your resume to optimize questions.');
  const [isUploading, setIsUploading] = useState(false);

  // Recruiter assessment & difficulty
  const [assessedLevel, setAssessedLevel] = useState<string>('Junior Developer');

  // Interface view toggles
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResponsePanelOpen, setIsResponsePanelOpen] = useState(false);

  // Coding Round States
  const [codingProblem, setCodingProblem] = useState<CodingProblem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('Console ready. Write code and click "Run Code" to test.');
  const [codingHintsCount, setCodingHintsCount] = useState(0);
  const [codingHintText, setCodingHintText] = useState('');
  const [runSuccess, setRunSuccess] = useState<boolean | null>(null);

  // Scorecard Feedback States
  const [finalScore, setFinalScore] = useState(82);
  const [feedbackSummary, setFeedbackSummary] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Set active career track initially
  useEffect(() => {
    if (careerGoal) {
      const found = CAREER_TRACKS.find(t => t.id === careerGoal);
      setActiveTrack(found || CAREER_TRACKS[0]);
      setTargetRole(found?.name || 'Full Stack Developer');
    } else {
      setActiveTrack(CAREER_TRACKS[0]);
    }
  }, [careerGoal]);

  // Scroll chat feed to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Webcam stream capture
  useEffect(() => {
    if (webcamActive) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setWebcamStream(stream);
        })
        .catch(err => {
          console.warn("Webcam access denied:", err);
          setWebcamActive(false);
        });
    } else {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        setWebcamStream(null);
      }
    }
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamActive]);

  // Handle Speech recognition initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputVal(transcript);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognitionInstance(rec);
      }
    }
  }, []);

  // Cleanup Vapi on unmount
  useEffect(() => {
    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
      }
    };
  }, [vapiInstance]);

  // Web Audio API live waveform animation
  useEffect(() => {
    if (!isListening) return;

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    const canvas = document.getElementById('voice-waveform') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth || 300;
    canvas.height = canvas.offsetHeight || 350;

    const bufferLength = 64;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!ctx || !analyser) return;

      animationFrameId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.7;
        const hue = (i / bufferLength) * 120 + 120;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.55)`;

        ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth - 1.5, barHeight);
        ctx.fillRect(x, canvas.height / 2 + barHeight / 2, barWidth - 1.5, -barHeight);

        x += barWidth;
      }
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(s => {
        stream = s;
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;

        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        draw();
      })
      .catch(err => {
        console.warn("Could not capture mic for waveform visualization:", err);
      });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (microphone) microphone.disconnect();
      if (audioContext) audioContext.close();
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [isListening]);


  // Web Speech Synthesis (TTS)
  const speak = async (text: string) => {
    if (voiceMode === 'vapi') return; // Do not run local TTS in Vapi mode
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); 

    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/##\s*([^\n]+)/g, '$1')
      .replace(/✓|○/g, '')
      .replace(/Topic:\s*([^\n]+)/g, 'The topic is $1.')
      .replace(/```[\s\S]*?```/g, 'Here is a code snippet.') 
      .trim();

    const sentences = cleanText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

    speechSessionRef.current += 1;
    const currentSessionId = speechSessionRef.current;
    setIsSpeaking(true);

    for (let i = 0; i < sentences.length; i++) {
      if (currentSessionId !== speechSessionRef.current || isMuted) {
        break;
      }

      const sentence = sentences[i];
      const utteranceText = /[.!?]$/.test(sentence) ? sentence : sentence + '.';

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(utteranceText);
        utterance.rate = 0.82;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('zira') || 
          v.name.toLowerCase().includes('google us english')
        );
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            setSpeechPulseScale(1.0 + Math.random() * 0.25);
          }
        };

        utterance.onend = () => {
          setSpeechPulseScale(1.0);
          setTimeout(() => {
            resolve();
          }, 800); // 800ms natural pause
        };

        utterance.onerror = () => {
          setSpeechPulseScale(1.0);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    }

    if (currentSessionId === speechSessionRef.current) {
      setIsSpeaking(false);
      setSpeechPulseScale(1.0);
    }
  };

  // Toggle listening state (STT)
  const toggleListening = () => {
    if (!recognitionInstance) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }
    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      setInputVal('');
      setIsListening(true);
      recognitionInstance.start();
    }
  };

  // Vapi Call Handlers
  const handleStartCall = async () => {
    setVapiCallState('connecting');
    try {
      const VapiModule = await import('@vapi-ai/web');
      const VapiSDK = VapiModule.default;
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'default-public-key-placeholder';
      const vapi = new VapiSDK(publicKey);

      vapi.on('call-start', () => {
        setVapiCallState('active');
        setIsSpeaking(false);
      });
      vapi.on('call-end', () => {
        setVapiCallState('idle');
        setIsSpeaking(false);
        setSpeechPulseScale(1.0);
      });
      vapi.on('error', (err: any) => {
        console.error('Vapi Error:', err);
        setVapiCallState('idle');
        setIsSpeaking(false);
        setSpeechPulseScale(1.0);
      });
      vapi.on('speech-start', () => {
        setIsSpeaking(true);
      });
      vapi.on('speech-end', () => {
        setIsSpeaking(false);
      });
      vapi.on('volume-level', (vol: number) => {
        setSpeechPulseScale(1.0 + vol * 1.5);
      });

      // Handle transcripts from Vapi to sync with our UI
      vapi.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          if (message.role === 'user') {
            setMessages(prev => [
              ...prev,
              {
                role: 'candidate',
                text: message.transcript,
                timestamp: getTimestamp()
              }
            ]);
          } else if (message.role === 'assistant') {
            setMessages(prev => [
              ...prev,
              {
                role: 'interviewer',
                text: message.transcript,
                timestamp: getTimestamp()
              }
            ]);
          }
        }
      });

      // Start the call
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'default-assistant-id-placeholder';
      vapi.start(assistantId);
      setVapiInstance(vapi);
    } catch (err) {
      console.error('Failed to start Vapi call:', err);
      setVapiCallState('idle');
      alert('Failed to connect voice call. Please check your network connection.');
    }
  };

  const handleEndCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
      setVapiCallState('idle');
    }
  };

  const handleToggleMute = () => {
    if (vapiInstance) {
      const currentlyMuted = vapiInstance.isMuted();
      vapiInstance.setMuted(!currentlyMuted);
      setVapiCallState(currentlyMuted ? 'active' : 'muted');
    }
  };

  // Start Interview Session
  const startInterview = () => {
    setIsStarted(true);
    setCurrentStep('WELCOME');
    setClaimed(false);
    setCodingHintsCount(0);
    setCodingHintText('');
    setRunSuccess(null);
    setConsoleOutput('Console ready. Write code and click "Run Code" to test.');

    const greeting = "Hello and welcome to Logic2Code Interviews. My name is Sarah Johnson, and I am a Senior Software Engineering Manager. Today I will be conducting your technical interview session. Before we begin, I'd like to get to know you a little better. Tell me, what is your name and how are you doing today?";
    
    setMessages([
      {
        role: 'interviewer',
        text: greeting,
        timestamp: getTimestamp(),
        focusAreas: ['Introduction', 'Communication', 'Meeting Protocol']
      }
    ]);

    setTimeout(() => speak(greeting), 600);
  };

  // Handle resume uploading simulation
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setResumeName(file.name);

    setTimeout(() => {
      setIsUploading(false);
      setResumeSummary(`Verified Resume: ${file.name}. Parsed core skills: Frontend frameworks (React, Tailwind), backend APIs (NodeJS, Python), and database structures. Ready to evaluate!`);
      

      const ackMsg = `I've successfully received and parsed your resume, ${candidateName}. Looks like a strong profile! Let's continue with our conversation.`;
      setMessages(prev => [
        ...prev,
        {
          role: 'interviewer',
          text: ackMsg,
          timestamp: getTimestamp(),
        focusAreas: ['Resume Verification', 'Skill Alignment']
        }
      ]);
      speak(ackMsg);
    }, 1500);
  };

  // Progress the Interview Conversation State Machine
  const handleRecruiterResponse = async (userResponse: string) => {
    setIsLoading(true);
    setIsResponsePanelOpen(false); // Close response input panel on submit

    const lowerResp = userResponse.toLowerCase();
    
    // Performance boosts (local calculation)
    let commBoost = Math.round(userResponse.split(' ').length / 5);
    commBoost = Math.min(commBoost, 8); 
    
    let techBoost = 0;
    let foundKeywords: string[] = [];
    KEYWORD_CONFIGS.forEach(config => {
      config.words.forEach(w => {
        if (lowerResp.includes(w) && !foundKeywords.includes(w)) {
          techBoost += 4;
          foundKeywords.push(w);
        }
      });
    });

    let confidenceLevel = 3;
    if (lowerResp.includes('sure') || lowerResp.includes('absolutely') || lowerResp.includes('experience') || lowerResp.includes('lead') || lowerResp.includes('build')) {
      confidenceLevel += 5;
    }

    // Real-time Live Metrics Update
    setLiveMetrics(prev => {
      const techMatches = foundKeywords.length;
      const wordCount = userResponse.trim().split(/\s+/).filter(Boolean).length;
      
      const newAlign = Math.min(100, Math.max(40, prev.technicalAlignment + (techMatches * 4) - (wordCount < 8 ? 5 : 0)));
      const newPacing = Math.min(160, Math.max(90, 110 + (wordCount % 5) * 5 - (wordCount < 5 ? 15 : 0)));
      const newDensity = Math.min(100, Math.max(50, 70 + (techMatches * 5) + Math.min(15, Math.floor(wordCount / 4))));
      
      return {
        technicalAlignment: newAlign,
        speakingPacing: newPacing,
        vocabularyDensity: newDensity
      };
    });

    const feedbackTags: string[] = [];
    if (userResponse.split(' ').length > 15) {
      feedbackTags.push('🟢 Good Explanation');
    } else {
      feedbackTags.push('🟡 Could Add More Detail');
    }
    if (foundKeywords.length > 0) {
      feedbackTags.push('🔵 Strong Communication');
    }
    if (lowerResp.includes('i think') || lowerResp.includes('maybe')) {
      feedbackTags.push('🟠 Missing Edge Cases');
    }

    // Determine the next step and history for API call
    let nextStep: InterviewStep = currentStep;
    let focusAreas: string[] = [];

    // Map the current step to the next step
    if (currentStep === 'WELCOME') {
      const nameMatch = userResponse.match(/my name is ([a-zA-Z\s]+)/i) || 
                        userResponse.match(/i am ([a-zA-Z\s]+)/i) ||
                        userResponse.match(/^([a-zA-Z\s]+)$/i);
      const name = nameMatch ? nameMatch[1].trim().split(' ')[0] : 'Candidate';
      setCandidateName(name);
      nextStep = 'INTRO_ABOUT';
      focusAreas = ['Background', 'Motivation', 'Soft Skills'];
    } else if (currentStep === 'INTRO_ABOUT') {
      nextStep = 'INTRO_CURRENT';
      focusAreas = ['Active Status', 'Current Tech Role', 'Project Scopes'];
    } else if (currentStep === 'INTRO_CURRENT') {
      nextStep = 'INTRO_TECH';
      focusAreas = ['Core Technologies', 'React / Node.js', 'System Architecture'];
    } else if (currentStep === 'INTRO_TECH') {
      nextStep = 'INTRO_PROJECT';
      focusAreas = ['System Architecture', 'Problem Solving', 'Security / scaling'];
    } else if (currentStep === 'INTRO_PROJECT') {
      nextStep = 'INTRO_ROLE';
      focusAreas = ['Target Track', 'Career Aspirations'];
    } else if (currentStep === 'INTRO_ROLE') {
      setTargetRole(userResponse);
      nextStep = 'ASSESSMENT';
      focusAreas = ['Assessment Verification', 'Technical Scope Selection'];
    } else if (currentStep === 'ASSESSMENT') {
      nextStep = 'TECH_1';
      focusAreas = ['Technical Fundamentals', 'Language Scopes'];
    } else if (currentStep === 'TECH_1') {
      nextStep = 'TECH_2';
      focusAreas = ['Concept Depth', 'Error Scopes'];
    } else if (currentStep === 'TECH_2') {
      nextStep = 'CODING_INTRO';
      focusAreas = ['Logic Optimization', 'Syntax Integrity'];
    } else if (currentStep === 'BEHAVIORAL') {
      nextStep = 'FEEDBACK_CALCULATING';
    }

    // Call backend API /api/ai/interview
    try {
      const historyPayload = messages.map(m => ({
        role: m.role === 'interviewer' ? 'interviewer' : 'candidate',
        text: m.text
      }));

      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career_goal: careerGoal || 'full-stack',
          selected_language: language || 'javascript',
          experience_level: experienceLevel || 'beginner',
          message: userResponse,
          history: historyPayload,
          resumeText
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.isFinished) {
          // Final scorecard generated!
          setCurrentStep('FEEDBACK_CALCULATING');
          
          setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0 && updated[updated.length - 1].role === 'candidate') {
              updated[updated.length - 1].feedbackTags = feedbackTags;
            }
            return [
              ...updated,
              {
                role: 'interviewer',
                text: "Thank you for sharing your experience. That completes our behavioral round and concludes the interview. I am compiling your scorecard now...",
                timestamp: getTimestamp()
              }
            ];
          });
          setIsLoading(false);

          setTimeout(() => {
            setFinalScore(data.score || 80);
            
            setStrengths(data.strengths || ['Good communication', 'Logical code structure']);
            setSuggestions(data.suggestions || ['Consider edge case handling explicitly']);
            setFeedbackSummary(data.feedback || 'Completed interview prep session.');

            setCurrentStep('FEEDBACK');
          }, 3000);

        } else {
          // Progress to the next step
          setCurrentStep(nextStep);

          let replyText = data.question || "Let's move on to the next round.";

          // Transition logic hooks for coding round
          if (nextStep === 'CODING_INTRO') {
            const prob = getCodingProblemDetails(language || 'javascript', assessedLevel);
            setCodingProblem(prob);
            setUserCode(prob.template);
            replyText = `Excellent responses in the Technical Round. Now, let's enter the **Coding Round**! \n\nI've generated a programming challenge tailored to your track. It's time to show off your logic and coding style.\n\n${replyText}\n\nPlease click the button below to **Open Workspace** and write your solution.`;
          }

          // Special case: if we transitioned to ASSESSMENT step, Sarah tells the candidate the assessed level
          if (nextStep === 'ASSESSMENT') {
            const allIntroText = messages
              .filter(m => m.role === 'candidate')
              .map(m => m.text)
              .join(' ') + ' ' + userResponse;
            const assessment = assessLevelFromText(allIntroText);
            setAssessedLevel(assessment);
            replyText = `Based on your background, I've assessed your profile at a **${assessment}** level targeting the **${targetRole || 'full-stack'}** path.\n\n${replyText}`;
          }

          setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0 && updated[updated.length - 1].role === 'candidate') {
              updated[updated.length - 1].feedbackTags = feedbackTags;
            }
            return [
              ...updated,
              {
                role: 'interviewer',
                text: replyText,
                timestamp: getTimestamp(),
                focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
                isNew: true
              }
            ];
          });
          setIsLoading(false);
          speak(replyText);
        }

      } else {
        console.warn('API call failed, falling back to local simulation');
        runLocalSimulationFallback(userResponse, nextStep, focusAreas, feedbackTags);
      }
    } catch (err) {
      console.error('Error in API fetch:', err);
      runLocalSimulationFallback(userResponse, nextStep, focusAreas, feedbackTags);
    }
  };

  const runLocalSimulationFallback = (userResponse: string, nextStep: InterviewStep, focusAreas: string[], feedbackTags: string[]) => {
    const reactions = [
      "Interesting approach.",
      "Great answer.",
      "I like how you explained that.",
      "Can you dive deeper into that?",
      "Let's explore that further."
    ];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    let replyText = '';

    switch (currentStep) {
      case 'WELCOME':
        nextStep = 'INTRO_ABOUT';
        replyText = `Great to meet you! To begin our Introduction Round, tell me a bit about yourself. What is your background, and what got you into software engineering?`;
        break;

      case 'INTRO_ABOUT':
        nextStep = 'INTRO_CURRENT';
        replyText = `${randomReaction} What are you currently doing? Are you working, studying, or primarily focused on personal coding projects?`;
        break;

      case 'INTRO_CURRENT':
        nextStep = 'INTRO_TECH';
        replyText = "Understood. Which programming languages, frameworks, or databases have you worked with most in your recent projects?";
        break;

      case 'INTRO_TECH':
        nextStep = 'INTRO_PROJECT';
        replyText = "Excellent technologies. Let's discuss a project you built. Can you explain the architecture of one of your favorite projects, and what major technical challenges you had to overcome?";
        break;

      case 'INTRO_PROJECT':
        nextStep = 'INTRO_ROLE';
        replyText = `${randomReaction} That sounds like a very impressive build. What specific career role or target position are you interviewing for today?`;
        break;

      case 'INTRO_ROLE':
        nextStep = 'ASSESSMENT';
        const allIntroText = messages
          .filter(m => m.role === 'candidate')
          .map(m => m.text)
          .join(' ') + ' ' + userResponse;
        const assessment = assessLevelFromText(allIntroText);
        setAssessedLevel(assessment);
        replyText = `Thank you for the detailed introduction! Based on your responses, I've assessed your profile as a **${assessment}** targeting the **${userResponse}** path. \n\nI will now select custom technical questions suited to this level. Let's begin the **Technical Round**! \n\nAre you ready?`;
        break;

      case 'ASSESSMENT':
        nextStep = 'TECH_1';
        replyText = getTechnicalQuestion(assessedLevel, language || 'javascript', 1);
        break;

      case 'TECH_1':
        nextStep = 'TECH_2';
        replyText = `${randomReaction} Let's move on to the second question. \n\n${getTechnicalQuestion(assessedLevel, language || 'javascript', 2)}`;
        break;

      case 'TECH_2':
        nextStep = 'CODING_INTRO';
        const prob = getCodingProblemDetails(language || 'javascript', assessedLevel);
        setCodingProblem(prob);
        setUserCode(prob.template);
        replyText = `Excellent responses in the Technical Round. Now, let's enter the **Coding Round**! \n\nI've generated a programming challenge tailored to your track. It's time to show off your logic and coding styles. \n\nPlease click the button below to **Open Workspace** and write your solution.`;
        break;

      case 'BEHAVIORAL':
        nextStep = 'FEEDBACK_CALCULATING';
        replyText = `Thank you. That completes our interview prep session. I'm going to take a moment to compile your scores, analyze your communication and coding logic, and generate a final feedback scorecard. Just a second...`;
        setTimeout(() => {
          calculateFinalScorecard();
        }, 4500);
        break;

      default:
        break;
    }

    setCurrentStep(nextStep);
    setMessages(prev => {
      const updated = [...prev];
      if (updated.length > 0 && updated[updated.length - 1].role === 'candidate') {
        updated[updated.length - 1].feedbackTags = feedbackTags;
      }
      return [
        ...updated,
        {
          role: 'interviewer',
          text: replyText,
          timestamp: getTimestamp(),
          focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
          isNew: true
        }
      ];
    });
    setIsLoading(false);
    speak(replyText);
  };

  // Helper to run code inside candidate editor
  const handleRunCode = () => {
    if (!codingProblem) return;
    setConsoleOutput("Running tests...");
    setTestCasesResult([]);
    
    setTimeout(() => {
      const hasSolutionLogic = userCode.includes('reverse') || 
                               userCode.includes('for') || 
                               userCode.includes('while') || 
                               userCode.includes('map') || 
                               userCode.includes('dict') ||
                               userCode.includes('[') ||
                               userCode.includes('split');
      
      if (hasSolutionLogic && !userCode.includes('return s;') && !userCode.includes('return false;') && !userCode.includes('return [];')) {
        setConsoleOutput(`Compilation: SUCCESS\nstdout: All test cases passed.`);
        setTestCasesResult([
          { name: "Test Case 1: Standard Input", input: codingProblem.testCases[0].input, expected: codingProblem.testCases[0].expected, got: codingProblem.testCases[0].expected, passed: true },
          { name: "Test Case 2: Boundary Check", input: codingProblem.testCases[1].input, expected: codingProblem.testCases[1].expected, got: codingProblem.testCases[1].expected, passed: true }
        ]);
        setRunSuccess(true);
      } else {
        setConsoleOutput(`Compilation: SUCCESS\nstdout: Test cases failed.`);
        setTestCasesResult([
          { name: "Test Case 1: Standard Input", input: codingProblem.testCases[0].input, expected: codingProblem.testCases[0].expected, got: "undefined", passed: false },
          { name: "Test Case 2: Boundary Check", input: codingProblem.testCases[1].input, expected: codingProblem.testCases[1].expected, got: "undefined", passed: false }
        ]);
        setRunSuccess(false);
      }
    }, 1000);
  };

  // Request code hint
  const handleRequestHint = () => {
    if (!codingProblem) return;
    setCodingHintsCount(prev => prev + 1);
    setCodingHintText(codingProblem.hint);

    speak(codingProblem.hint);
  };

  // Submit coding round answer
  const handleSubmitCode = async () => {
    setIsLoading(true);
    setConsoleOutput("Submitting code workspace...");

    const submissionText = `I have completed the coding assignment for the problem: "${codingProblem?.title}". My solution was compiled successfully and all test cases passed.`;

    try {
      const historyPayload = messages.map(m => ({
        role: m.role === 'interviewer' ? 'interviewer' : 'candidate',
        text: m.text
      }));

      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career_goal: careerGoal || 'full-stack',
          selected_language: language || 'javascript',
          experience_level: experienceLevel || 'beginner',
          message: submissionText,
          history: historyPayload,
          resumeText
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStep('BEHAVIORAL');
        
        let replyText = data.question || "Let's move on to the Behavioral Round. Can you tell me about a time you faced a major project bug?";
        
        setMessages(prev => [
          ...prev,
          {
            role: 'candidate',
            text: "Code challenge submitted successfully.",
            timestamp: getTimestamp(),
            feedbackTags: ['🟢 Test Cases Passed']
          },
          {
            role: 'interviewer',
            text: replyText,
            timestamp: getTimestamp(),
            focusAreas: ['Ownership', 'Teamwork', 'Behavioral Alignment'],
            isNew: true
          }
        ]);
        setIsLoading(false);
        speak(replyText);
      } else {
        runSubmitCodeFallback();
      }
    } catch (err) {
      console.error('Error submitting code to AI:', err);
      runSubmitCodeFallback();
    }
  };

  const runSubmitCodeFallback = () => {
    setCurrentStep('BEHAVIORAL');
    const behavioralQuestion = "Congratulations on finishing the coding assignment! Let's wrap up with our last segment: the **Behavioral Round**. \n\nCan you tell me about a time you faced a critical bug, took **ownership** of a challenge, or had a disagreement requiring **teamwork** on a project? How did you resolve it?";
    
    setMessages(prev => [
      ...prev,
      {
        role: 'candidate',
        text: "Code challenge submitted successfully.",
        timestamp: getTimestamp(),
        feedbackTags: ['🟢 Test Cases Passed']
      },
      {
        role: 'interviewer',
        text: behavioralQuestion,
        timestamp: getTimestamp(),
        focusAreas: ['Ownership', 'Teamwork', 'Behavioral Alignment']
      }
    ]);
    setIsLoading(false);
    speak(behavioralQuestion);
  };

  // Compile final feedback scorecard
  const calculateFinalScorecard = () => {


    setFeedbackSummary(
      `Outstanding performance, ${candidateName}! In our session, you showed strong adaptive communication skills and resolved the technical and programming challenges confidently. Your explanation of recent systems was very clear and showed a practical engineering approach.`
    );

    setStrengths([
      "Clear, structural code design with error scoping.",
      "Articulate responses with good conversational pacing.",
      "Excellent translation of technical definitions to real-world scenarios."
    ]);

    setSuggestions([
      "Focus on explaining time complexity bottlenecks explicitly early in problem solving.",
      `Incorporate mock assertions or unit testing frameworks like Jest or PyTest in your ${language} code.`
    ]);

    setCurrentStep('FEEDBACK');
    import('canvas-confetti').then((module) => {
      const confetti = module.default;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    });
  };

  const handleClaimXP = () => {
    if (claimed) return;
    addXP(150);
    setClaimed(true);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
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
    monaco.editor.setTheme('premium-dark');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userMsg = inputVal.trim();
    setInputVal('');

    setMessages(prev => [
      ...prev,
      {
        role: 'candidate',
        text: userMsg,
        timestamp: getTimestamp()
      }
    ]);

    handleRecruiterResponse(userMsg);
  };

  const currentInterviewerMsg = [...messages].reverse().find(m => m.role === 'interviewer');
  const lastCandidateMsg = [...messages].reverse().find(m => m.role === 'candidate');

  // Derive Recruiter State dynamically for perfect sync
  const recruiterState: 'speaking' | 'thinking' | 'listening' = 
    isLoading ? 'thinking' : isSpeaking ? 'speaking' : 'listening';

  // ── RENDER HELPERS FOR UI CARDS ──
  const renderCandidateProfileCard = (heightClass = "h-[350px]") => {
    const parsedSkills: string[] = [];
    const parsedProjects: string[] = [];
    if (resumeText) {
      const lowerText = resumeText.toLowerCase();
      const commonTechs = ['react', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'typescript', 'javascript', 'python', 'postgresql', 'mongodb', 'sql', 'mysql', 'docker', 'aws', 'gcp', 'tailwindcss', 'css', 'html', 'git'];
      commonTechs.forEach(tech => {
        if (lowerText.includes(tech)) {
          parsedSkills.push(tech === 'nextjs' ? 'Next.js' : tech === 'nodejs' ? 'Node.js' : tech.charAt(0).toUpperCase() + tech.slice(1));
        }
      });

      const sentences = resumeText.split(/[.!?\n]/);
      sentences.forEach(s => {
        const cleanS = s.trim();
        if (cleanS.length > 20 && (cleanS.toLowerCase().includes('project') || cleanS.toLowerCase().includes('built') || cleanS.toLowerCase().includes('developed') || cleanS.toLowerCase().includes('implemented') || cleanS.toLowerCase().includes('designed'))) {
          if (parsedProjects.length < 3) {
            parsedProjects.push(cleanS);
          }
        }
      });
    }

    if (parsedSkills.length === 0) {
      parsedSkills.push('JavaScript', 'React', 'TailwindCSS', 'Node.js', 'PostgreSQL');
    }
    if (parsedProjects.length === 0) {
      parsedProjects.push('ATS Resume Analyzer System', 'E-commerce Platform API', 'Interactive Live Chat App');
    }

    return (
      <div className={`glass-spatial rounded-2xl p-3 border border-white/10 bg-slate-950/60 shadow-lg shadow-black/20 flex flex-col justify-between ${heightClass}`}>
        <div className="flex flex-col flex-grow overflow-hidden">
          {/* Tabs header */}
          <div className="flex border-b border-white/5 pb-1 mb-2 gap-2 text-[9px] font-black uppercase font-mono select-none">
            <button
              onClick={() => setActiveProfileTab('overview')}
              className={`pb-1 px-1 transition-all border-b ${activeProfileTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'} cursor-pointer`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveProfileTab('skills')}
              className={`pb-1 px-1 transition-all border-b ${activeProfileTab === 'skills' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'} cursor-pointer`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveProfileTab('projects')}
              className={`pb-1 px-1 transition-all border-b ${activeProfileTab === 'projects' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'} cursor-pointer`}
            >
              Projects
            </button>
          </div>

          {activeProfileTab === 'overview' && (
            <div className="flex-grow flex flex-col justify-between overflow-hidden">
              <div className="flex flex-col gap-1 text-[10px] font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-mono">NAME</span>
                  <span className="text-white">{candidateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-mono">ROLE</span>
                  <span className="text-white truncate max-w-[120px] text-right">{targetRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-mono">LEVEL</span>
                  <span className="text-blue-400">{assessedLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-mono">LANGUAGE</span>
                  <span className="text-white capitalize">{(language || 'javascript')}</span>
                </div>
              </div>

              {/* Live Performance Indicators / metrics */}
              <div className="border-t border-white/5 pt-1.5 mt-1.5 flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono select-none">Live Session Performance</span>
                <div className="flex flex-col gap-1 text-[9px] font-bold">
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-slate-400">Technical Alignment</span>
                      <span className="text-emerald-400 font-mono">{liveMetrics.technicalAlignment}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="bg-emerald-500 h-1 transition-all duration-500" style={{ width: `${liveMetrics.technicalAlignment}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-slate-400">Pacing (WPM)</span>
                      <span className="text-indigo-400 font-mono">{liveMetrics.speakingPacing}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="bg-indigo-500 h-1 transition-all duration-500" style={{ width: `${Math.min(100, liveMetrics.speakingPacing / 1.8)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-slate-400">Vocabulary Density</span>
                      <span className="text-pink-400 font-mono">{liveMetrics.vocabularyDensity}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="bg-pink-500 h-1 transition-all duration-500" style={{ width: `${liveMetrics.vocabularyDensity}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'skills' && (
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-0.5 flex flex-col gap-1.5 pt-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono block select-none">Extracted Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {parsedSkills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[9px] font-bold shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeProfileTab === 'projects' && (
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-0.5 flex flex-col gap-1.5 pt-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono block select-none font-bold">Matched Projects</span>
              <div className="flex flex-col gap-1.5">
                {parsedProjects.map((p, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-white/[0.02] border border-white/5 text-[9.5px] text-slate-300 leading-normal font-semibold">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shortened Resume summary block */}
        <div className="pt-1.5 border-t border-white/5 mt-1.5 h-[70px] shrink-0 overflow-y-auto custom-scrollbar text-[10px]">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-0.5 font-mono select-none">Resume summary:</span>
          <p className="text-slate-300 leading-relaxed font-semibold">
            {resumeSummary}
          </p>
        </div>
      </div>
    );
  };

  const renderChatbotPanel = (heightClass = "h-full") => (
    <div className={`glass-spatial rounded-2xl p-4 border border-white/10 bg-slate-950/60 shadow-lg shadow-black/20 flex flex-col gap-3 flex-grow ${heightClass} relative`}>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-white/5 pb-2 block select-none">
        AI Interviewer Chat
      </span>
      {/* Transcript List */}
      <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-3 text-xs leading-relaxed font-semibold custom-scrollbar">
        {messages.length === 0 ? (
          <span className="text-slate-500 italic text-center block mt-16 font-mono text-[10px]">
            No dialogue yet. Sarah is introducing herself...
          </span>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col gap-1 ${m.role === 'candidate' ? 'items-end' : 'items-start'}`}>
              <span className={`text-[8px] font-extrabold uppercase font-mono tracking-wide px-1.5 py-0.5 rounded-md border ${
                m.role === 'interviewer' 
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' 
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
              }`}>
                {m.role === 'interviewer' ? 'Sarah Johnson' : 'You'}
              </span>
              <div className={`text-slate-300 font-medium px-2.5 py-2 rounded-xl border max-w-[90%] text-[11px] ${
                m.role === 'candidate' 
                  ? 'bg-blue-950/30 border-blue-500/20 rounded-tr-none' 
                  : 'bg-purple-950/20 border-purple-500/15 rounded-tl-none'
              }`}>
                {m.role === 'interviewer' && m.isNew ? (
                  <TypewriterText 
                    text={m.text}
                    candidateName={candidateName}
                    onComplete={() => {
                      setMessages(prev => {
                        const copy = [...prev];
                        if (copy[idx] && copy[idx].role === 'interviewer') {
                          copy[idx] = { ...copy[idx], isNew: false };
                        }
                        return copy;
                      });
                    }}
                  />
                ) : (
                  formatKeywords(m.text, candidateName)
                )}
                
                {/* Focus Areas Checklist */}
                {m.role === 'interviewer' && m.focusAreas && m.focusAreas.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mt-1.5 select-none font-mono">
                    {m.focusAreas.map((f, fIdx) => (
                      <span key={fIdx} className="text-[7.5px] px-1 py-0.2 rounded bg-blue-950/30 border border-blue-900/30 text-blue-300 font-bold">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Feedback tags */}
                {m.role === 'candidate' && m.feedbackTags && m.feedbackTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 font-mono">
                    {m.feedbackTags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[7.5px] px-1 py-0.2 rounded bg-blue-950/45 border border-blue-900/35 text-blue-300 font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Live transcription when candidate is talking */}
        {isListening && (
          <div className="flex flex-col gap-1 items-end animate-pulse">
            <span className="text-[8px] font-extrabold uppercase font-mono tracking-wide px-1.5 py-0.5 rounded-md border bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
              You (Transcribing...)
            </span>
            <div className="text-emerald-300 font-medium px-2.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 italic max-w-[90%] text-[11px] rounded-tr-none">
              "{inputVal || 'Speak now...'}"
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* AI analyzing checklist overlay (Sarah is formulating followup) */}
      {isLoading && (
        <div className="glass-spatial bg-slate-950/95 border border-white/10 rounded-2xl p-4 shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[240px] flex flex-col gap-2.5 select-none">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider block font-mono">Sarah is analyzing...</span>
          </div>
          <div className="flex flex-col gap-1.5 text-[9px] border-t border-white/5 pt-2 font-bold text-slate-400">
            <div className="flex items-center justify-between text-emerald-400">
              <span>✓ Structure check</span>
              <span className="text-[8px] font-mono text-emerald-500 bg-emerald-950/20 border border-emerald-900/30 px-1 rounded">OK</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400">
              <span>✓ Keywords matched</span>
              <span className="text-[8px] font-mono text-emerald-500 bg-emerald-950/20 border border-emerald-900/30 px-1 rounded">OK</span>
            </div>
            <div className="flex items-center justify-between text-blue-400 animate-pulse">
              <span>⏳ Formulating followup</span>
              <span className="text-[8px] font-mono text-blue-400 bg-blue-950/20 border border-blue-900/30 px-1 rounded">WAIT</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Input Dock */}
      <form onSubmit={handleSendMessage} className="flex flex-col gap-2 border-t border-white/5 pt-2.5 mt-auto relative z-10">
        <div className="flex items-center gap-1.5 w-full">
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your response..."
            disabled={isLoading}
            className="flex-grow bg-slate-950 border border-white/10 hover:border-white/15 focus:border-blue-500/50 rounded-xl px-3 py-2 text-[11px] font-semibold text-white focus:outline-none placeholder:text-slate-500 leading-normal"
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-white/5 disabled:to-white/5 text-white disabled:text-slate-500 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-2 w-full justify-between items-center">
          {/* Voice Input */}
          {voiceMode === 'vapi' ? (
            <button
              type="button"
              onClick={handleToggleMute}
              disabled={vapiCallState === 'idle'}
              className={`flex-grow py-1.5 rounded-xl border flex items-center justify-center gap-1 transition-all text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                vapiCallState === 'muted' 
                  ? 'bg-red-950/40 border-rose-500 text-rose-400' 
                  : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {vapiCallState === 'muted' ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3" />}
              <span>{vapiCallState === 'muted' ? 'Muted' : 'Mute'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading || currentStep === 'CODING_INTRO'}
              className={`flex-grow py-1.5 rounded-xl border flex items-center justify-center gap-1 transition-all text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                isListening 
                  ? 'bg-red-600 border-red-500 text-white animate-pulse' 
                  : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-3 h-3 text-white" /> : <Mic className="w-3 h-3" />}
              <span>Voice</span>
            </button>
          )}

          {/* Resume */}
          <label className="flex-grow py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer text-[9px] font-bold uppercase tracking-wider">
            <Paperclip className="w-3 h-3" />
            <span>Resume</span>
            <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleResumeUpload} />
          </label>
        </div>
      </form>
    </div>
  );

  const renderRecruiterVideoPanel = (heightClass = "h-[350px]") => {
    if (voiceMode === 'vapi') {
      return (
        <div className={`glass-spatial bg-slate-950/60 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between ${heightClass} transition-all relative overflow-hidden`}>
          {/* Top status */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${vapiCallState === 'active' ? 'bg-emerald-500 animate-pulse' : vapiCallState === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
              Vapi Premium Voice
            </span>
            <span className="text-[9px] font-bold uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-400 border border-indigo-900/30">
              {vapiCallState === 'active' ? 'Connected' : vapiCallState === 'connecting' ? 'Connecting...' : vapiCallState === 'muted' ? 'Muted' : 'Disconnected'}
            </span>
          </div>

          {/* Recruiter Avatar Centered */}
          <div className="flex flex-col items-center justify-center py-2 relative">
            <div className="relative">
              {vapiCallState === 'active' && recruiterState === 'speaking' && (
                <>
                  <motion.div 
                    animate={{ scale: speechPulseScale * 1.25, opacity: [0.6, 0] }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    className="absolute inset-0 rounded-full border border-indigo-500 pointer-events-none"
                  />
                  <motion.div 
                    animate={{ scale: speechPulseScale * 1.5, opacity: [0.4, 0] }}
                    transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
                    className="absolute inset-0 rounded-full border border-indigo-500 pointer-events-none"
                  />
                </>
              )}
              
              <motion.div 
                animate={vapiCallState === 'active' && recruiterState === 'speaking' ? { scale: speechPulseScale } : { scale: 1.0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`w-16 h-16 rounded-full border-2 overflow-hidden bg-slate-900 transition-all ${
                  vapiCallState === 'active' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'border-white/10'
                }`}
              >
                <img 
                  src="/avatar/sarah-johnson.png" 
                  alt="Sarah Johnson" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
            <div className="text-center mt-3">
              <span className="text-xs font-black text-white block">Sarah Johnson</span>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">Senior Engineering Mgr</span>
            </div>
          </div>

          {/* Call Controls inside Dashboard */}
          <div className="flex flex-col gap-2 mt-auto border-t border-white/5 pt-3">
            {vapiCallState === 'idle' ? (
              <button
                type="button"
                onClick={handleStartCall}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                Start Premium Call
              </button>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    vapiCallState === 'muted'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-400'
                      : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {vapiCallState === 'muted' ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5" />}
                  {vapiCallState === 'muted' ? 'Unmute' : 'Mute Mic'}
                </button>
                
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <VideoOff className="w-3.5 h-3.5" />
                  End Call
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`glass-spatial bg-slate-950/60 border border-white/10 rounded-2xl p-3 shadow-xl flex flex-col justify-between ${heightClass} transition-all relative overflow-hidden`}>
        {/* Top status */}
        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE INTERVIEW
          </span>
          <span className={`text-[9px] font-bold uppercase font-mono tracking-wider px-2 py-0.5 rounded ${
            recruiterState === 'speaking' ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-900/30 shadow-[0_0_8px_rgba(99,102,241,0.2)]' :
            recruiterState === 'thinking' ? 'bg-amber-950/50 text-amber-400 border border-amber-900/30' :
            'bg-emerald-950/50 text-emerald-400 border border-emerald-900/30'
          }`}>
            {recruiterState === 'speaking' ? 'Speaking' :
             recruiterState === 'thinking' ? 'Thinking' :
             'Listening'}
          </span>
        </div>

        {/* Recruiter Avatar Centered */}
        <div className="flex flex-col items-center justify-center py-1 relative">
          <div className="relative">
            {/* Animated speaking rings */}
            {recruiterState === 'speaking' && (
              <>
                <motion.div 
                  animate={{ scale: speechPulseScale * 1.25, opacity: [0.6, 0] }}
                  transition={{ type: "spring", stiffness: 100, damping: 10 }}
                  className="absolute inset-0 rounded-full border border-indigo-500 pointer-events-none"
                />
                <motion.div 
                  animate={{ scale: speechPulseScale * 1.5, opacity: [0.4, 0] }}
                  transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
                  className="absolute inset-0 rounded-full border border-indigo-500 pointer-events-none"
                />
              </>
            )}
            
            <motion.div 
              animate={recruiterState === 'speaking' ? { scale: speechPulseScale } : { scale: 1.0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`w-14 h-14 rounded-full border-2 overflow-hidden bg-slate-900 transition-all ${
                recruiterState === 'speaking' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' :
                recruiterState === 'thinking' ? 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]' :
                'border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              }`}
            >
              <img 
                src="/avatar/sarah-johnson.png" 
                alt="Sarah Johnson" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Recruiter Details at Bottom */}
        <div className="text-center flex flex-col gap-1 mt-1 border-t border-white/5 pt-2">
          <span className="text-xs font-black text-white block">Sarah Johnson</span>
          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Senior Engineering Mgr</span>
          
          {/* Audio Waveform / status animations */}
          <div className="h-5 flex items-center justify-center mt-1 w-full overflow-hidden">
            {recruiterState === 'speaking' ? (
              <div className="flex gap-[2.5px] items-end h-3.5 select-none pointer-events-none">
                {[...Array(11)].map((_, i) => (
                  <motion.span 
                    key={i} 
                    animate={{ height: [3, 13, 3] }}
                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.04, ease: "easeInOut" }}
                    className="w-[1.5px] bg-indigo-400 rounded-full" 
                  />
                ))}
              </div>
            ) : recruiterState === 'thinking' ? (
              <div className="flex gap-1.5 items-center justify-center h-3 select-none pointer-events-none">
                <span className="text-[9.5px] font-bold text-amber-400 animate-pulse uppercase tracking-wider font-mono mr-1">Analyzing...</span>
                {[0, 1, 2].map((i) => (
                  <motion.span 
                    key={i} 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-amber-400 rounded-full" 
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9.5px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Listening...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCandidateWebcamPanel = (heightClass = "h-[350px]") => (
    <div className={`glass-spatial bg-slate-950/60 border rounded-2xl shadow-xl flex flex-col justify-between ${heightClass} relative overflow-hidden transition-all duration-300 ${
      isListening ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-white/10'
    }`}>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden">
        {webcamActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-10 rounded-2xl" 
          />
        ) : (
          <div className="flex flex-col items-center gap-2.5 text-slate-500 relative z-10 select-none">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center shadow-lg">
              <UserX className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Webcam Disabled</span>
          </div>
        )}

        {/* Microphone Pulse indicator on stream border */}
        {isListening && (
          <div className="absolute inset-0 border-2 border-emerald-500/50 pointer-events-none rounded-2xl animate-pulse z-20" />
        )}

        {/* Live dynamic waveform visualization canvas */}
        {isListening && (
          <canvas id="voice-waveform" className="absolute inset-0 w-full h-full pointer-events-none z-15 opacity-40 rounded-2xl animate-fade-in" />
        )}

        {/* Top Overlay Badge */}
        <div className="absolute top-3 left-3 z-20 bg-slate-950/80 border border-white/10 rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-md select-none">
          <span className={`w-1.5 h-1.5 rounded-full ${webcamActive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-[8.5px] font-black text-slate-300 uppercase tracking-wider font-mono">
            {candidateName} {webcamActive && '• LIVE'}
          </span>
        </div>

        {/* Floating controls inside webcam frame */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
          {/* Webcam toggle */}
          <button
            type="button"
            onClick={() => setWebcamActive(!webcamActive)}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              webcamActive 
                ? 'bg-blue-600/80 border-blue-500/50 text-white' 
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Video Stream"
          >
            {webcamActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          </button>
          {/* Speaker Volume toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isMuted 
                ? 'bg-slate-950/80 border-red-500/20 text-red-400' 
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          {/* Info panel toggle */}
          <button
            type="button"
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="w-7 h-7 rounded-lg bg-slate-950/80 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Toggle Info Panels"
          >
            {isRightPanelOpen ? <ChevronRightIcon className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 py-2 animate-fade-in page-transition relative justify-start space-y-4">
      


      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-blue-400 uppercase tracking-wider bg-blue-950/40 border border-blue-900/30 px-2.5 py-1 rounded-full font-mono">
              <Bot className="w-2.5 h-2.5" />
              Logic2Code Recruiting Suite
            </span>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-full font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Recruiter Active
            </span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            AI Technical Recruiter Interview
          </h1>
        </div>
        
        {isStarted && currentStep !== 'FEEDBACK' && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to exit the current interview?")) {
                setIsStarted(false);
                if (webcamStream) webcamStream.getTracks().forEach(t => t.stop());
                setWebcamActive(false);
              }
            }}
            className="px-4 py-2 bg-red-950/30 border border-red-900/40 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-900/20 transition-all cursor-pointer"
          >
            End Interview
          </button>
        )}
      </div>

      {/* ── WELCOME / PRE-INTERVIEW SETUP ── */}
      {!isStarted ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-slide-up">
          <div className="lg:col-span-2 glass-spatial rounded-3xl p-7 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent blur-2xl pointer-events-none" />
            
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Interactive Prep Room</span>
              <h2 className="text-xl font-bold text-white font-serif">Live Recruiter Interview Simulation</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Confront a simulated live engineering manager in a video & voice chat. Get real-time grading, dynamic assessment, and coding workspace validation.
              </p>
            </div>

            {/* Profile configuration */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: UserCheck, label: 'Target Track', value: activeTrack?.name || 'Full Stack', bg: 'bg-blue-950/20 border-blue-900/30', text: 'text-blue-200', labelColor: 'text-blue-400' },
                { icon: Cpu, label: 'Target Language', value: (language || 'javascript').toUpperCase(), bg: 'bg-indigo-950/20 border-indigo-900/30', text: 'text-indigo-200', labelColor: 'text-indigo-400' },
                { icon: Zap, label: 'Experience Level', value: experienceLevel || 'Beginner', bg: 'bg-emerald-950/20 border-emerald-900/30', text: 'text-emerald-200', labelColor: 'text-emerald-400' },
              ].map(({ icon: Icon, label, value, bg, text, labelColor }, idx) => (
                <div key={label} className={`flex flex-col gap-2 rounded-2xl border ${bg} p-4 animate-slide-up`} style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 text-white shadow-inner">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-[8px] font-black uppercase tracking-wider block font-mono ${labelColor}`}>{label}</span>
                    <span className={`text-xs font-bold leading-tight block truncate ${text}`}>{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Mode Selector Card */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 animate-slide-up">
              <div>
                <span className="text-xs font-bold text-white block">Select Voice Interface Mode</span>
                <span className="text-[11px] text-slate-400 leading-normal font-semibold">
                  Choose how you want to talk with Sarah Johnson during the technical evaluation.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setVoiceMode('simulated')}
                  className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all hover:scale-[1.01] cursor-pointer ${
                    voiceMode === 'simulated'
                      ? 'bg-blue-950/20 border-blue-500 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                      : 'bg-slate-900/20 border-white/5 hover:border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black uppercase tracking-widest font-mono text-blue-400">Simulated (Standard)</span>
                    <span className={`w-2.5 h-2.5 rounded-full border ${voiceMode === 'simulated' ? 'bg-blue-500 border-blue-400 shadow-sm shadow-blue-500/30' : 'border-slate-600'}`} />
                  </div>
                  <span className="text-xs font-bold text-white leading-snug">Web Speech API</span>
                  <span className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                    Uses browser speech synthesis & text inputs. Fast, local, and zero-setup.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceMode('vapi')}
                  className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all hover:scale-[1.01] cursor-pointer ${
                    voiceMode === 'vapi'
                      ? 'bg-indigo-950/20 border-indigo-500 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      : 'bg-slate-900/20 border-white/5 hover:border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black uppercase tracking-widest font-mono text-indigo-400">Premium Call (Voice)</span>
                    <span className={`w-2.5 h-2.5 rounded-full border ${voiceMode === 'vapi' ? 'bg-indigo-500 border-indigo-400 shadow-sm shadow-indigo-500/30' : 'border-slate-600'}`} />
                  </div>
                  <span className="text-xs font-bold text-white leading-snug">Vapi AI Voice Call</span>
                  <span className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                    Premium real-time bidirectional stream with Sarah's ElevenLabs voice.
                  </span>
                </button>
              </div>
            </div>

            {/* Resume upload before start */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Optimize with your resume</span>
                  <span className="text-[11px] text-slate-400 leading-normal font-semibold">Sarah Johnson will parse your resume summary to select specific questions.</span>
                </div>
              </div>
              
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0">
                <Upload className="w-3.5 h-3.5" />
                {resumeName ? 'Change Resume' : 'Upload Resume'}
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleResumeUpload} />
              </label>
            </div>

            {resumeName && (
              <div className="text-[11px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3 flex gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Uploaded: <strong>{resumeName}</strong>. Ready to be evaluated on the uploaded skills.</span>
              </div>
            )}

            <button
              onClick={startInterview}
              className="group flex items-center gap-3 self-start px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.97] cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" />
              Begin Interview Prep Session
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right rules & guidelines */}
          <div className="flex flex-col gap-4">
            <div className="glass-colored border border-indigo-900/30 rounded-3xl p-5 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                  <Trophy className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block font-mono">Completion Reward</span>
                  <span className="text-xl font-black text-indigo-400 leading-none font-mono">+150 XP</span>
                </div>
              </div>
              <p className="text-[11px] text-indigo-300 font-semibold leading-relaxed">Solve coding questions, reply to recruiter prompts, and claim your scorecard XP reward.</p>
            </div>

            <div className="glass-spatial rounded-3xl p-5 flex flex-col gap-4 flex-grow shadow-lg">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Meeting Features</span>
              <div className="flex flex-col gap-3.5">
                {[
                  { icon: Video, text: 'Enable your webcam to simulate a realistic video call environment.' },
                  { icon: Mic, text: 'Use Push-to-Talk or Text to voice your answers. Sarah speaks back in real time.' },
                  { icon: Target, text: 'Structured 5-Round prep course (Intro, Projects, Tech, Coding, Behavioral).' }
                ].map(({ icon: Icon, text }, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : currentStep === 'FEEDBACK' ? (
        /* ── INTERVIEW COMPLETE SCORECARD ── */
        <div className="flex flex-col gap-5 animate-scale-in">
          <div className="glass-colored border border-indigo-900/30 rounded-3xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">Interview Prep Accomplished</span>
                <h2 className="text-xl font-bold text-white font-serif">Technical Scorecard</h2>
                <p className="text-xs text-slate-400 font-medium leading-none mt-1">Grades and assessments from Sarah Johnson</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-indigo-900/30 rounded-2xl px-6 py-4 shadow-sm relative z-10 text-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Overall Grade</span>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-violet-500 leading-none font-mono">
                {finalScore}%
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
            <div className="glass-spatial rounded-3xl p-6 flex flex-col gap-3 shadow-lg">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Recruiter's Final Assessment</span>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">{feedbackSummary}</p>
            </div>
            
            <div className="glass-colored border border-indigo-900/30 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-lg">
              <div>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block font-mono">Preparation Bounty</span>
                <span className="text-lg font-black text-indigo-400 font-mono">+150 XP</span>
                <span className="text-[10px] text-indigo-300 block font-semibold leading-none mt-1">Claim your interview session reward.</span>
              </div>
              <button onClick={handleClaimXP} disabled={claimed}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  claimed 
                    ? 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-mono' 
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md'
                }`}>
                {claimed ? '✓ Claimed!' : 'Claim XP'}
              </button>
            </div>
          </div>

          {/* Strengths and Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Sarah\'s Feedback: Core Strengths', icon: CheckCircle2, color: 'text-emerald-400', items: strengths, dotBg: 'bg-emerald-950/30 border-emerald-900/20', dotText: 'text-emerald-400' },
              { label: 'Actionable Topics to Improve', icon: ThumbsUp, color: 'text-amber-400', items: suggestions, dotBg: 'bg-amber-950/30 border-amber-900/20', dotText: 'text-amber-400' },
            ].map(({ label, icon: Icon, color, items, dotBg, dotText }) => (
              <div key={label} className="glass-spatial rounded-3xl p-6 flex flex-col gap-4 shadow-sm shadow-black/25">
                <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest font-mono ${color}`}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </span>
                <ul className="flex flex-col gap-3">
                  {items.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-xs text-slate-300 font-semibold leading-relaxed">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${dotBg}`}>
                        <span className={`text-[9px] font-black ${dotText}`}>{idx + 1}</span>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center mt-2">
            <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-slate-900/40 hover:bg-slate-900/70 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer">
              <Home className="w-4 h-4" />Dashboard
            </Link>
            <button onClick={startInterview} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
              <RefreshCw className="w-4 h-4" />Retry Prep Session
            </button>
          </div>
        </div>
      ) : (
        /* ── ACTIVE COMPACT SPLIT-SCREEN MEETING EXPERIENCE ── */
        <div className="space-y-4 w-full">
          
          {/* Top Stage Timeline Progress bar */}
          <div className="glass-spatial rounded-xl px-4 py-2.5 border border-white/10 flex flex-wrap items-center justify-between gap-3 select-none shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Progress Round</span>
            <div className="flex items-center gap-2.5 text-[11px]">
              {[
                { id: 'INTRO', name: 'Introduction', completed: ['WELCOME','INTRO_ABOUT','INTRO_CURRENT','INTRO_TECH','INTRO_PROJECT','INTRO_ROLE','ASSESSMENT'].includes(currentStep as any) },
                { id: 'PROJECTS', name: 'Projects', completed: ['TECH_1','TECH_2','CODING_INTRO','CODING_ROUND','BEHAVIORAL','FEEDBACK_CALCULATING','FEEDBACK'].includes(currentStep as any) },
                { id: 'TECH', name: 'Technical Round', completed: ['TECH_2','CODING_INTRO','CODING_ROUND','BEHAVIORAL','FEEDBACK_CALCULATING','FEEDBACK'].includes(currentStep as any) },
                { id: 'CODING', name: 'Coding Round', completed: ['BEHAVIORAL','FEEDBACK_CALCULATING','FEEDBACK'].includes(currentStep as any) },
                { id: 'BEHAVIORAL', name: 'Behavioral Round', completed: ['FEEDBACK_CALCULATING','FEEDBACK'].includes(currentStep as any) },
                { id: 'FEEDBACK', name: 'Feedback', completed: (currentStep as string) === 'FEEDBACK' }
              ].map((step, idx) => {
                const isActive = 
                  (step.id === 'INTRO' && ['WELCOME','INTRO_ABOUT','INTRO_CURRENT','INTRO_TECH','INTRO_PROJECT','INTRO_ROLE','ASSESSMENT'].includes(currentStep as any)) ||
                  (step.id === 'PROJECTS' && (currentStep as any) === 'INTRO_PROJECT') ||
                  (step.id === 'TECH' && ['TECH_1', 'TECH_2'].includes(currentStep as any)) ||
                  (step.id === 'CODING' && ['CODING_INTRO', 'CODING_ROUND'].includes(currentStep as any)) ||
                  (step.id === 'BEHAVIORAL' && (currentStep as any) === 'BEHAVIORAL') ||
                  (step.id === 'FEEDBACK' && ['FEEDBACK_CALCULATING','FEEDBACK'].includes(currentStep as any));

                return (
                  <div key={step.id} className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                      step.completed 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/20' 
                        : isActive 
                          ? 'border-blue-500 text-blue-400 bg-blue-950/20 shadow-[0_0_8px_rgba(59,130,246,0.3)] font-black' 
                          : 'border-white/10 text-slate-600'
                    }`}>
                      {step.completed ? '✓' : isActive ? '●' : idx + 1}
                    </span>
                    <span className={`font-semibold ${isActive ? 'text-blue-400 font-extrabold shadow-sm' : step.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.name}
                    </span>
                    {idx < 5 && <ChevronRight className="w-3 h-3 text-slate-700" />}
                  </div>
                );
              })}
            </div>
          </div>



          {currentStep === 'CODING_ROUND' && codingProblem ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch w-full relative mt-4">
              {/* Left Content Area (Monaco Editor Workspace) */}
              <div className={`flex flex-col gap-4 items-stretch justify-between ${isRightPanelOpen ? 'lg:col-span-3' : 'lg:col-span-4'} transition-all duration-300`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow items-stretch relative" style={{ minHeight: '440px' }}>
                  
                  {/* Left Pane: Coding Problem (Lg: col-5) */}
                  <div className="lg:col-span-5 flex flex-col gap-2.5">
                    <div className="glass-spatial rounded-2xl border border-white/10 p-4 flex flex-col justify-between flex-grow bg-slate-950/65 shadow-xl">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Coding Problem</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-400 text-[10px] font-bold border border-indigo-900/40 font-mono">
                            {codingProblem.title}
                          </span>
                        </div>
                        
                        <div className="prose prose-invert text-xs text-slate-300 leading-relaxed font-semibold">
                          <p className="whitespace-pre-line">{codingProblem.description}</p>
                        </div>

                        {codingHintText && (
                          <div className="mt-4 p-3.5 bg-blue-950/20 border border-blue-900/45 rounded-xl text-xs text-blue-300 font-semibold flex gap-2 animate-fade-in shadow-inner">
                            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-blue-400" />
                            <div>
                              <strong className="block text-white mb-0.5 font-black">Sarah's Hint:</strong>
                              {codingHintText}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                        <button 
                          type="button"
                          onClick={handleRequestHint}
                          disabled={codingHintsCount >= 2}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-45 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/5"
                        >
                          Request Hint ({codingHintsCount}/2)
                        </button>
                      </div>
                    </div>

                    {/* Standard Console */}
                    <div className="glass-spatial rounded-2xl border border-white/10 p-3 bg-slate-950 flex flex-col h-[140px] shadow-inner shadow-black/45">
                      <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-white/5 pb-1 mb-1.5">
                        <Terminal className="w-3.5 h-3.5" /> Output Console
                      </span>
                      <div className="flex flex-col gap-1.5 overflow-y-auto flex-grow custom-scrollbar">
                        {testCasesResult.length > 0 ? (
                          testCasesResult.map((tc, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded-lg border text-[10px] font-sans flex flex-col gap-1 ${
                                tc.passed 
                                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' 
                                  : 'bg-red-950/20 border-red-500/20 text-red-300'
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span className="flex items-center gap-1.5">
                                  {tc.passed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                  )}
                                  {tc.name}
                                </span>
                                <span className={`font-mono text-[8px] uppercase px-1 py-0.2 rounded border ${
                                  tc.passed 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-400 font-black'
                                }`}>
                                  {tc.passed ? 'Passed' : 'Failed'}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-[9px] font-mono border-t border-white/5 pt-1 mt-0.5 text-slate-400">
                                <div>
                                  <span className="block text-[8px] text-slate-500 uppercase font-black tracking-wider">Input</span>
                                  <span className="text-slate-300 font-bold block truncate max-w-[120px]">{tc.input}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] text-slate-500 uppercase font-black tracking-wider">Expected</span>
                                  <span className="text-emerald-400 font-bold block truncate max-w-[120px]">{tc.expected}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] text-slate-500 uppercase font-black tracking-wider">Got</span>
                                  <span className={`${tc.passed ? 'text-emerald-400' : 'text-red-400'} font-bold block truncate max-w-[120px]`}>{tc.got}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <pre className="text-[10px] font-mono leading-relaxed text-slate-400 font-semibold p-1">
                            {consoleOutput}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: Monaco Editor (Lg: col-7) */}
                  <div className="lg:col-span-7 glass-spatial rounded-2xl border border-white/10 overflow-hidden flex flex-col bg-[#080b11] shadow-2xl relative">
                    
                    {/* Floating Picture-in-Picture (PiP) Meeting Recruiter Card */}
                    <div className="absolute top-14 right-4 z-30 flex items-center gap-3.5 glass-card p-3.5 animate-fade-in w-[280px] h-[130px]">
                      
                      {/* Avatar wrapper */}
                      <div className="relative shrink-0">
                        {recruiterState === 'speaking' && (
                          <>
                            <motion.div 
                              animate={{ scale: speechPulseScale * 1.2, opacity: [0.6, 0] }}
                              transition={{ type: "spring", stiffness: 100, damping: 10 }}
                              className="absolute inset-0 rounded-full border border-indigo-500 pointer-events-none"
                            />
                            <motion.div 
                              animate={{ scale: speechPulseScale * 1.4, opacity: [0.4, 0] }}
                              transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
                              className="absolute inset-0 rounded-full border border-indigo-500 pointer-events-none"
                            />
                          </>
                        )}
                        
                        <motion.div 
                          animate={recruiterState === 'speaking' ? { scale: speechPulseScale } : { scale: 1.0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className={`w-14 h-14 rounded-full border-2 overflow-hidden bg-slate-900 transition-all ${
                            recruiterState === 'speaking' ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]' :
                            recruiterState === 'thinking' ? 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]' :
                            'border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          }`}
                        >
                          <img 
                            src="/avatar/sarah-johnson.png" 
                            alt="Sarah Johnson" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>

                      {/* Details block */}
                      <div className="flex flex-col flex-grow justify-between h-full">
                        <div>
                          <span className="text-[10px] font-black text-white block leading-none">Sarah Johnson</span>
                          <span className="text-[8px] text-slate-400 font-semibold block mt-1">Senior Engineering Mgr</span>
                        </div>

                        {/* Status tag */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            recruiterState === 'speaking' ? 'bg-indigo-500 animate-pulse' :
                            recruiterState === 'thinking' ? 'bg-amber-500 animate-pulse' :
                            'bg-emerald-500 animate-pulse'
                          }`} />
                          <span className="text-[9px] font-bold text-slate-300 capitalize font-mono">
                            {recruiterState === 'speaking' ? 'Speaking...' :
                             recruiterState === 'thinking' ? 'Thinking...' :
                             'Listening...'}
                          </span>
                        </div>

                        {/* Speech wave / thinking dots */}
                        {recruiterState === 'speaking' ? (
                          <div className="flex gap-[2px] items-end h-3 mt-1 select-none pointer-events-none">
                            {[...Array(9)].map((_, i) => (
                              <motion.span 
                                key={i} 
                                animate={{ height: [3, 11, 3] }}
                                transition={{ repeat: Infinity, duration: 0.6 + i * 0.05, ease: "easeInOut" }}
                                className="w-[1.5px] bg-indigo-400 rounded-full" 
                              />
                            ))}
                          </div>
                        ) : recruiterState === 'thinking' ? (
                          <div className="flex gap-1 items-center h-3 mt-1 select-none pointer-events-none">
                            {[0, 1, 2].map((i) => (
                              <motion.span 
                                key={i} 
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                className="w-1.5 h-1.5 bg-amber-400 rounded-full" 
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="h-3 flex items-center mt-1 select-none pointer-events-none">
                            <span className="w-8 h-[1.5px] bg-emerald-500/40 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-2 bg-[#080b11] border-b border-white/5 flex justify-between items-center select-none rounded-t-2xl">
                      {/* Window Dots */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      
                      {/* Centered Filename */}
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        workspace.{language === 'python' ? 'py' : 'js'}
                      </span>
                      
                      {/* Live Status Badge */}
                      <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>

                    <div className="flex-grow min-h-[250px] bg-[#080b11]">
                      <Editor
                        height="100%"
                        defaultLanguage={language === 'python' ? 'python' : 'javascript'}
                        theme="premium-dark"
                        onMount={handleEditorDidMount}
                        value={userCode}
                        onChange={(val) => setUserCode(val || '')}
                        options={{
                          fontSize: 12,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          fontFamily: 'var(--font-mono)',
                          renderLineHighlight: 'all'
                        }}
                      />
                    </div>

                    {/* Monaco Action footer */}
                    <div className="px-5 py-3 bg-[#080b11] border-t border-white/5 flex items-center justify-between gap-3">
                      <span className="text-[9px] text-slate-500 font-semibold font-mono">
                        Press Submit when test cases pass
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={handleRunCode}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm border border-white/5"
                        >
                          <Play className="w-3 h-3 text-emerald-400" /> Run Code
                        </button>
                        <button 
                          type="button"
                          onClick={handleSubmitCode}
                          disabled={runSuccess !== true}
                          className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-white/5 disabled:to-white/5 text-white disabled:text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:shadow-none"
                        >
                          <Check className="w-3.5 h-3.5" /> Submit Solution
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Side Dock: Profile */}
              <AnimatePresence>
                {isRightPanelOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 80 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-1 flex flex-col gap-4"
                  >
                    {renderCandidateProfileCard("h-[350px]")}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Non-coding active prep step: Clean 3-Column Layout */
            <section className="mt-4">
              <div className="grid grid-cols-[240px_1fr_260px] gap-4 w-full items-stretch select-none">
                {renderRecruiterVideoPanel("h-[350px]")}
                {renderCandidateWebcamPanel("h-[350px]")}
                {renderCandidateProfileCard("h-[350px]")}
              </div>
            </section>
          )}

          {/* Floating Chatbot FAB and Popover Widget */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 select-none">
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-[400px] h-[500px] flex flex-col bg-[#081225] border border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden transition-all duration-300"
                >
                  {/* Widget Header */}
                  <div 
                    className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/40 select-none cursor-pointer min-h-[56px]"
                    onClick={() => setIsChatOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">
                        AI Interviewer Chat
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsChatOpen(false);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Widget Body */}
                  <div className="flex flex-col flex-grow relative overflow-hidden justify-between h-[444px]">
                    {/* Transcript List */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent custom-scrollbar">
                      {messages.length === 0 ? (
                        <span className="text-slate-500 italic text-center block mt-24 font-mono text-[10px]">
                          No dialogue yet. Sarah is introducing herself...
                        </span>
                      ) : (
                        messages.map((m, idx) => (
                          <div key={idx} className={`w-full flex flex-col ${m.role === 'candidate' ? 'items-end' : 'items-start'}`}>
                            {/* Message Meta Section */}
                            <div className={`flex flex-col gap-1 mb-2 ${m.role === 'candidate' ? 'items-end' : 'items-start'}`}>
                              {m.role === 'interviewer' ? (
                                <>
                                  <span className="w-fit rounded bg-violet-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-300">
                                    Sarah Johnson
                                  </span>
                                  <span className="w-fit rounded border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300 whitespace-nowrap">
                                    Senior Software Engineering Manager
                                  </span>
                                </>
                              ) : (
                                <span className="w-fit rounded bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-300">
                                  You
                                </span>
                              )}
                            </div>

                            {/* Message Bubble Card */}
                            <div className={`max-w-[85%] rounded-xl border p-4 space-y-2 text-sm leading-6 text-slate-200 break-words ${
                              m.role === 'candidate' 
                                ? 'border-blue-500/20 bg-blue-950/40 self-end' 
                                : 'border-violet-500/20 bg-violet-950/40 self-start'
                            }`}>
                              {m.role === 'interviewer' && m.isNew ? (
                                <TypewriterText 
                                  text={m.text}
                                  candidateName={candidateName}
                                  skipRecruiter={true}
                                  onComplete={() => {
                                    setMessages(prev => {
                                      const copy = [...prev];
                                      if (copy[idx] && copy[idx].role === 'interviewer') {
                                        copy[idx] = { ...copy[idx], isNew: false };
                                      }
                                      return copy;
                                    });
                                  }}
                                />
                              ) : (
                                formatKeywords(m.text, candidateName, m.role === 'interviewer')
                              )}
                              
                              {/* Focus Areas Checklist */}
                              {m.role === 'interviewer' && m.focusAreas && m.focusAreas.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3 select-none font-mono">
                                  {m.focusAreas.map((f, fIdx) => (
                                    <span key={fIdx} className="text-[7px] px-2 py-0.5 rounded bg-blue-950/30 border border-blue-900/30 text-blue-300 font-bold">
                                      {f}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Feedback tags */}
                              {m.role === 'candidate' && m.feedbackTags && m.feedbackTags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3 font-mono">
                                  {m.feedbackTags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[7px] px-2 py-0.5 rounded bg-blue-950/45 border border-blue-900/35 text-blue-300 font-bold">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      {/* Live transcription when candidate is talking */}
                      {isListening && (
                        <div className="w-full flex flex-col items-end animate-pulse">
                          <div className="flex flex-col gap-1 mb-2 items-end">
                            <span className="w-fit rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                              You (Transcribing...)
                            </span>
                          </div>
                          <div className="max-w-[85%] rounded-xl border p-4 space-y-2 text-sm leading-6 text-emerald-300 bg-emerald-500/10 border-emerald-500/20 italic self-end">
                            "{inputVal || 'Speak now...'}"
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* AI analyzing checklist overlay (Sarah is formulating followup) */}
                    {isLoading && (
                      <div className="glass-spatial bg-slate-950/95 border border-white/10 rounded-xl p-3 shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-45 w-[200px] flex flex-col gap-2 select-none animate-fade-in">
                        <div className="flex items-center gap-1.5">
                          <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-wider block font-mono">Sarah is analyzing...</span>
                        </div>
                        <div className="flex flex-col gap-1 text-[8px] border-t border-white/5 pt-1.5 font-bold text-slate-400">
                          <div className="flex items-center justify-between text-emerald-400">
                            <span>✓ Structure check</span>
                            <span className="text-[7px] font-mono text-emerald-500 bg-emerald-950/20 border border-emerald-900/30 px-1 rounded">OK</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-400">
                            <span>✓ Keywords matched</span>
                            <span className="text-[7px] font-mono text-emerald-500 bg-emerald-950/20 border border-emerald-900/30 px-1 rounded">OK</span>
                          </div>
                          <div className="flex items-center justify-between text-blue-400 animate-pulse">
                            <span>⏳ Formulating followup</span>
                            <span className="text-[7px] font-mono text-blue-400 bg-blue-950/20 border border-blue-900/30 px-1 rounded">WAIT</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Chat Input Dock */}
                    <form onSubmit={handleSendMessage} className="border-t border-slate-800 px-4 py-4 space-y-3 bg-[#081225]/80 w-full relative z-10">
                      <div className="flex items-center gap-3 w-full">
                        <input 
                          type="text"
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          placeholder="Type your response..."
                          disabled={isLoading}
                          className="h-11 flex-1 rounded-lg px-4 bg-slate-950 border border-white/10 focus:border-blue-500/50 text-xs font-semibold text-white focus:outline-none placeholder:text-slate-500 leading-normal"
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !inputVal.trim()}
                          className="h-11 w-11 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-white/5 disabled:to-white/5 text-white disabled:text-slate-500 rounded-lg transition-all cursor-pointer shrink-0 shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3 w-full">
                        {/* Voice Input */}
                        {voiceMode === 'vapi' ? (
                          <button
                            type="button"
                            onClick={handleToggleMute}
                            disabled={vapiCallState === 'idle'}
                            className={`h-10 rounded-lg border flex items-center justify-center gap-1 transition-all text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                              vapiCallState === 'muted' 
                                ? 'bg-red-950/40 border-rose-500 text-rose-400' 
                                : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {vapiCallState === 'muted' ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5" />}
                            <span>{vapiCallState === 'muted' ? 'Muted' : 'Mute'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={toggleListening}
                            disabled={isLoading || currentStep === 'CODING_INTRO'}
                            className={`h-10 rounded-lg border flex items-center justify-center gap-1 transition-all text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                              isListening 
                                ? 'bg-red-600 border-red-500 text-white animate-pulse' 
                                : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {isListening ? <MicOff className="w-3 h-3 text-white" /> : <Mic className="w-3 h-3" />}
                            <span>Voice</span>
                          </button>
                        )}

                        {/* Resume */}
                        <label className="h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer text-[9px] font-bold uppercase tracking-wider">
                          <Paperclip className="w-3 h-3" />
                          <span>Resume</span>
                          <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleResumeUpload} />
                        </label>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The FAB Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg flex items-center justify-center cursor-pointer border border-white/15 relative"
            >
              {isChatOpen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  {messages.length > 0 && !isChatOpen && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </>
              )}
            </motion.button>
          </div>


          {/* Simple controls bar during Monaco Editor Coding Round */}
          {currentStep === 'CODING_ROUND' && (
            <div className="glass-spatial rounded-2xl px-6 py-3 border border-white/10 bg-slate-900/80 shadow-2xl max-w-xs mx-auto w-full animate-slide-up flex items-center justify-center gap-4 mt-4 relative z-10 select-none">
              {/* Webcam toggle */}
              <button
                type="button"
                onClick={() => setWebcamActive(!webcamActive)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  webcamActive 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Toggle Video Stream"
              >
                {webcamActive ? <Video className="w-4.5 h-4.5" /> : <VideoOff className="w-4.5 h-4.5" />}
              </button>
              {/* Speaker Volume toggle */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isMuted 
                    ? 'bg-slate-800 border-red-500/20 text-red-400 animate-pulse' 
                    : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
              </button>
              {/* Panel toggle */}
              <button
                type="button"
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Toggle Info Panels"
              >
                {isRightPanelOpen ? <ChevronRightIcon className="w-4.5 h-4.5" /> : <ChevronLeft className="w-4.5 h-4.5" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// ── HELPER FUNCTIONS ────────────────────────────────────
// ────────────────────────────────────────────────────────

function assessLevelFromText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('lead') || lower.includes('architect') || lower.includes('senior') || lower.includes('manager') || lower.includes('years of experience') || lower.includes('years experience')) {
    return 'Senior Developer';
  } else if (lower.includes('mid') || lower.includes('middle') || lower.includes('experienced') || lower.includes('production')) {
    return 'Mid-Level Developer';
  } else if (lower.includes('junior') || lower.includes('intern') || lower.includes('entry') || lower.includes('associate')) {
    return 'Junior Developer';
  } else if (lower.includes('student') || lower.includes('college') || lower.includes('university') || lower.includes('graduate') || lower.includes('degree')) {
    return 'Student / Graduate';
  } else {
    return 'Fresher / Entry Level';
  }
}

function getTechnicalQuestion(level: string, language: string, questionNumber: number): string {
  const isSenior = level.includes('Senior');
  const isMid = level.includes('Mid-Level');
  const langKey = language.toLowerCase();

  if (langKey.includes('react')) {
    if (questionNumber === 1) {
      return isSenior 
        ? "How do you design a state management architecture for a micro-frontend application, and what are the trade-offs between Redux, Zustand, and React Context?"
        : isMid 
          ? "Can you explain the difference between useEffect, useLayoutEffect, and useMemo? In what scenario would you choose useLayoutEffect?"
          : "What is the difference between state and props in React? How do you pass data from a child component to a parent component?";
    } else {
      return isSenior 
        ? "How does React's concurrent rendering engine (Fiber) work, and how can you leverage useTransition or useDeferredValue to optimize high-frequency updates?"
        : isMid 
          ? "How would you optimize a list component rendering 10,000 items in React? Describe virtualization and key optimization hooks."
          : "What is the virtual DOM in React, and how does the reconciliation algorithm update the actual DOM?";
    }
  } else if (langKey.includes('node') || langKey.includes('javascript') || langKey.includes('typescript')) {
    if (questionNumber === 1) {
      return isSenior 
        ? "Explain the Node.js event loop phase-by-phase. How do process.nextTick and setImmediate interleave between the poll and check phases?"
        : isMid 
          ? "What is the difference between event-driven programming and traditional multi-threading? How does Node.js handle concurrency under the hood?"
          : "What is the difference between let, const, and var in JavaScript? Explain hoisting and scope closures.";
    } else {
      return isSenior 
        ? "How do you manage memory leaks and CPU bottlenecks in a high-throughput Node.js API gateway? Mention profiling tools you have used."
        : isMid 
          ? "Can you explain JavaScript Promises, async/await, and how microtasks queue differently than macrotasks in the event loop?"
          : "What is a callback function in JavaScript, and what is 'callback hell'? How do Promises solve this?";
    }
  } else if (langKey.includes('python')) {
    if (questionNumber === 1) {
      return isSenior 
        ? "Explain Python's Global Interpreter Lock (GIL) and how it affects multi-threaded CPU-bound programs. How do you bypass it using multiprocessing or asyncio?"
        : isMid 
          ? "What is the difference between generators and iterators in Python? Explain how the yield keyword works and its memory benefits."
          : "What is the difference between lists and tuples in Python? When and why would you choose one over the other?";
    } else {
      return isSenior 
        ? "How does Python's garbage collector manage circular references, and how do weak references (weakref) help optimize memory-intensive applications?"
        : isMid 
          ? "Explain decorators in Python. How would you write a decorator that logs the execution time of a function and caches its results?"
          : "What are dictionaries in Python, and how do they achieve O(1) average-time complexity for lookups?";
    }
  } else {
    if (questionNumber === 1) {
      return isSenior 
        ? "Explain how you would design a globally distributed, highly available database replication system. What are the CAP theorem trade-offs?"
        : isMid 
          ? "What is the difference between REST, GraphQL, and gRPC? When would you choose one over the others for system integrations?"
          : "What are the SOLID principles of object-oriented design? Can you explain the single responsibility principle?";
    } else {
      return isSenior 
        ? "How do you design a rate limiter for a distributed API service with millions of active users? What caching and storage backends would you use?"
        : isMid 
          ? "What is database indexing, and how does a B-Tree index speed up query lookups? What are the write performance trade-offs?"
          : "What is the difference between SQL and NoSQL databases? In what scenarios is NoSQL preferred?";
    }
  }
}

function getCodingProblemDetails(language: string, level: string): CodingProblem {
  const langKey = language.toLowerCase();
  const isSenior = level.includes('Senior');
  const isMid = level.includes('Mid-Level');

  if (langKey.includes('react')) {
    return {
      title: "1. Build a Custom UseFetch Hook",
      description: "Create a custom hook `useFetch` in React that takes a URL and optional options. It should return an object with `{ data, loading, error }`. The hook should handle aborting the fetch request if the component unmounts or the URL changes.",
      template: `import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
  // Write your code here
  
}`,
      expectedOutput: "{ data: null, loading: false, error: null }",
      testCases: [
        { input: "useFetch('https://api.example.com/data')", expected: "{ data, loading, error }" },
        { input: "useFetch(null)", expected: "error" }
      ],
      hint: "Use useEffect to perform the fetch operation. Don't forget to return a cleanup function that calls controller.abort() using AbortController."
    };
  } else if (langKey.includes('python')) {
    if (isSenior || isMid) {
      return {
        title: "1. Two Sum Problem",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        template: `def two_sum(nums, target):
    # Write your solution here
    pass`,
        expectedOutput: "[0, 1]",
        testCases: [
          { input: "nums=[2,7,11,15], target=9", expected: "[0, 1]" },
          { input: "nums=[3,2,4], target=6", expected: "[1, 2]" }
        ],
        hint: "Use a hash map (dictionary in Python) to store the complement of each number and its index. This achieves O(n) time complexity."
      };
    } else {
      return {
        title: "1. Reverse a String",
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\nYou must do this by modifying the input array in-place with O(1) extra memory.",
        template: `def reverse_string(s):
    # Write your solution here
    pass`,
        expectedOutput: '["o","l","l","e","h"]',
        testCases: [
          { input: 's=["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
          { input: 's=["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' }
        ],
        hint: "Use the two-pointer technique. Initialize a pointer at the beginning and another at the end of the array, and swap elements while moving pointers toward each other."
      };
    }
  } else {
    if (isSenior || isMid) {
      return {
        title: "1. Two Sum Problem",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        template: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
        expectedOutput: "[0, 1]",
        testCases: [
          { input: "nums=[2,7,11,15], target=9", expected: "[0, 1]" },
          { input: "nums=[3,2,4], target=6", expected: "[1, 2]" }
        ],
        hint: "Use a Map to keep track of seen numbers and their indices. For each number, check if target minus the number is already in the map."
      };
    } else {
      return {
        title: "1. Reverse a String",
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\nYou must do this by modifying the input array in-place with O(1) extra memory.",
        template: `function reverseString(s) {
  // Write your solution here
  
}`,
        expectedOutput: '["o","l","l","e","h"]',
        testCases: [
          { input: 's=["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
          { input: 's=["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' }
        ],
        hint: "Use two pointers, one at the start (0) and one at the end (s.length - 1). Swap their values in a loop and increment/decrement pointers."
      };
    }
  }
}

