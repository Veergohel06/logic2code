'use client';

import { useState, useEffect } from 'react';
import useLanguage from './useLanguage';
import { CAREER_TRACKS } from '@/config/careerRoadmaps';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  sources?: { id: string; title: string }[];
}

export function useTutor(problemId?: string) {
  const { language, careerGoal, experienceLevel } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [hints, setHints] = useState<string[]>([]);
  const [loadingHint, setLoadingHint] = useState<boolean>(false);

  const storageKey = problemId 
    ? `logic2code_tutor_history_${language}_${problemId}` 
    : `logic2code_tutor_history_${language}_global`;

  // Initialize and load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const restored = parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
          setMessages(restored);
          setHints([]);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading chat history:', e);
    }

    const getWelcomeMessage = () => {
      const track = CAREER_TRACKS.find((t: any) => t.id === careerGoal);
      const trackName = track ? track.name : '';
      const langName = language === 'cpp' ? 'C++' : language === 'javascript' ? 'JavaScript' : language === 'typescript' ? 'TypeScript' : language.charAt(0).toUpperCase() + language.slice(1);
      const levelName = experienceLevel ? experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1) : '';

      if (trackName) {
        return `Hi! I am your ${langName} Mentor for the **${trackName}** track${levelName ? ` (${levelName} level)` : ''}. I'm here to help you build logic, master code syntax, and prepare for career projects. What problem are we tackling today?`;
      }

      switch (language) {
        case 'python':
          return "Hi! I am your Python Mentor. I'm here to help you write clean, readable, and Pythonic code. What logic problem are we tackling today?";
        case 'r':
          return "Hi! I am your R Data Analysis Mentor. I'm here to help you filter dataframes, clean missing records, and create summary metrics. What problem are we tackling today?";
        case 'javascript':
          return "Hello! I am your JS Tutor. We can explore DOM events, async callbacks, closures, and browser APIs together. How can I help you build today?";
        case 'typescript':
          return "Welcome! Let's write some type-safe code in TypeScript. I can assist with interfaces, generics, types, and compiler configs. Ask away!";
        case 'java':
          return "Greetings! I am your Java Instructor. Ready to dive into Object-Oriented patterns, inheritance, Collections, or Threads? Let me know what you need!";
        case 'cpp':
          return "Hello! I am your C++ Coach. Ready to master pointers, memory references, stack vs heap, and standard libraries? Let's write fast code!";
        case 'go':
          return "Hey there! Ready to write some concurrent Go programs? I can guide you through goroutines, channels, and select blocks. What's on your mind?";
        default:
          return `Welcome! I am your coding tutor for ${langName}. Ask me any questions, and let's start coding!`;
      }
    };

    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: getWelcomeMessage(),
        timestamp: new Date()
      }
    ]);
    setHints([]);
  }, [language, careerGoal, experienceLevel, problemId]);

  // Persist messages to localStorage on updates
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (e) {
        console.error('Error saving chat history:', e);
      }
    }
  }, [messages, storageKey]);

  const clearChat = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error('Error clearing chat history:', e);
    }
    const track = CAREER_TRACKS.find((t: any) => t.id === careerGoal);
    const trackName = track ? track.name : '';
    const langName = language === 'cpp' ? 'C++' : language === 'javascript' ? 'JavaScript' : language === 'typescript' ? 'TypeScript' : language.charAt(0).toUpperCase() + language.slice(1);
    const welcomeText = trackName 
      ? `Chat history cleared. Hi! I am your ${langName} Mentor. Ask me any questions to get started!`
      : `Chat history cleared. Hi! I am your ${langName} Mentor. How can I help you build today?`;

    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
    setHints([]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_language: language,
          career_goal: careerGoal,
          experience_level: experienceLevel,
          difficulty: 'Medium',
          problem_type: 'Logic Building',
          user_level: 'Explorer',
          message: text,
          history: messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
          problemId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: data.response,
          timestamp: new Date(),
          sources: data.sources || []
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'ai',
            text: 'I ran into an issue connecting to the learning model. Please check back shortly!',
            timestamp: new Date()
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: 'Error connecting: ' + String(err),
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const getHint = async () => {
    setLoadingHint(true);
    try {
      const response = await fetch('/api/ai/hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_language: language,
          career_goal: careerGoal,
          experience_level: experienceLevel,
          difficulty: 'Medium',
          problem_type: 'Logic Building',
          user_level: 'Explorer',
          problemId
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hints) {
          setHints(data.hints);
        }
      }
    } catch (err) {
      console.error('Failed to get hints:', err);
    } finally {
      setLoadingHint(false);
    }
  };

  return {
    messages,
    sendMessage,
    isThinking,
    hints,
    getHint,
    loadingHint,
    clearChat
  };
}

export default useTutor;
