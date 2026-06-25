'use client';

import { useState, useEffect } from 'react';
import languageStore from '../stores/languageStore';

export function useLanguage() {
  const [language, setLanguageState] = useState(() => languageStore.getLanguage());
  const [compareMode, setCompareModeState] = useState(() => languageStore.getCompareMode());
  const [careerGoal, setCareerGoalState] = useState(() => languageStore.getCareerGoal());
  const [experienceLevel, setExperienceLevelState] = useState(() => languageStore.getExperienceLevel());
  const [displayName, setDisplayNameState] = useState(() => languageStore.getDisplayName());
  const [avatarId, setAvatarIdState] = useState(() => languageStore.getAvatarId());
  const [theme, setThemeState] = useState(() => languageStore.getTheme());

  useEffect(() => {
    const unsubLang = languageStore.subscribeLanguage((lang) => {
      setLanguageState(lang);
    });

    const unsubCompare = languageStore.subscribeCompare((val) => {
      setCompareModeState(val);
    });

    const unsubCareer = languageStore.subscribeCareer((goal) => {
      setCareerGoalState(goal);
    });

    const unsubLevel = languageStore.subscribeLevel((lvl) => {
      setExperienceLevelState(lvl);
    });

    const unsubName = languageStore.subscribeName((name) => {
      setDisplayNameState(name);
    });

    const unsubAvatar = languageStore.subscribeAvatar((id) => {
      setAvatarIdState(id);
    });

    const unsubTheme = languageStore.subscribeTheme((t) => {
      setThemeState(t);
    });

    // Handle updates in case store changed during render
    setLanguageState(languageStore.getLanguage());
    setCompareModeState(languageStore.getCompareMode());
    setCareerGoalState(languageStore.getCareerGoal());
    setExperienceLevelState(languageStore.getExperienceLevel());
    setDisplayNameState(languageStore.getDisplayName());
    setAvatarIdState(languageStore.getAvatarId());
    setThemeState(languageStore.getTheme());

    return () => {
      unsubLang();
      unsubCompare();
      unsubCareer();
      unsubLevel();
      unsubName();
      unsubAvatar();
      unsubTheme();
    };
  }, []);

  const setLanguage = (lang: string) => {
    languageStore.setLanguage(lang);
  };

  const setCompareMode = (val: boolean) => {
    languageStore.setCompareMode(val);
  };

  const setCareerGoal = (goal: string) => {
    languageStore.setCareerGoal(goal);
  };

  const setExperienceLevel = (level: string) => {
    languageStore.setExperienceLevel(level);
  };

  const setDisplayName = (name: string) => {
    languageStore.setDisplayName(name);
  };

  const setAvatarId = (id: string) => {
    languageStore.setAvatarId(id);
  };

  const setTheme = (t: string) => {
    languageStore.setTheme(t);
  };

  return {
    language,
    setLanguage,
    compareMode,
    setCompareMode,
    careerGoal,
    setCareerGoal,
    experienceLevel,
    setExperienceLevel,
    displayName,
    setDisplayName,
    avatarId,
    setAvatarId,
    theme,
    setTheme,
    getDraft: (problemId: string, langId: string) => languageStore.getDraft(problemId, langId),
    setDraft: (problemId: string, langId: string, code: string) => languageStore.setDraft(problemId, langId, code)
  };
}

export default useLanguage;
