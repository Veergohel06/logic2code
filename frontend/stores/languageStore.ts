type LanguageListener = (lang: string) => void;
type CompareListener = (val: boolean) => void;
type DraftsListener = (drafts: Record<string, string>) => void;
type CareerListener = (goal: string) => void;
type LevelListener = (level: string) => void;
type NameListener = (name: string) => void;
type AvatarListener = (id: string) => void;

class LanguageStore {
  private currentLanguage = 'python';
  private compareMode = false;
  private careerGoal = '';
  private experienceLevel = '';
  private displayName = '';
  private avatarId = '1';
  private theme = 'premium-dark';
  private drafts: Record<string, string> = {}; // problemId-langId -> code

  private langListeners = new Set<LanguageListener>();
  private compareListeners = new Set<CompareListener>();
  private draftsListeners = new Set<DraftsListener>();
  private careerListeners = new Set<CareerListener>();
  private levelListeners = new Set<LevelListener>();
  private nameListeners = new Set<NameListener>();
  private avatarListeners = new Set<AvatarListener>();
  private themeListeners = new Set<(theme: string) => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      // Load initial state from LocalStorage
      const savedLang = localStorage.getItem('l2c_preferred_language');
      if (savedLang) {
        this.currentLanguage = savedLang;
      }
      const savedCompare = localStorage.getItem('l2c_compare_mode');
      if (savedCompare) {
        this.compareMode = savedCompare === 'true';
      }
      const savedGoal = localStorage.getItem('l2c_career_goal');
      if (savedGoal) {
        this.careerGoal = savedGoal;
      }
      const savedLevel = localStorage.getItem('l2c_experience_level');
      if (savedLevel) {
        this.experienceLevel = savedLevel;
      }
      const savedName = localStorage.getItem('l2c_display_name');
      if (savedName) {
        this.displayName = savedName;
      }
      const savedAvatar = localStorage.getItem('l2c_avatar_id');
      if (savedAvatar) {
        this.avatarId = savedAvatar;
      }
      const savedTheme = localStorage.getItem('l2c_monaco_theme');
      if (savedTheme) {
        this.theme = savedTheme;
      }
      const savedDrafts = localStorage.getItem('l2c_editor_drafts');
      if (savedDrafts) {
        try {
          this.drafts = JSON.parse(savedDrafts);
        } catch (e) {
          console.error('Error parsing drafts', e);
        }
      }

      // Load profile details from database if logged in
      this.syncFromDb();
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getCompareMode() {
    return this.compareMode;
  }

  getCareerGoal() {
    return this.careerGoal;
  }

  getExperienceLevel() {
    return this.experienceLevel;
  }

  getDisplayName() {
    return this.displayName;
  }

  getAvatarId() {
    return this.avatarId;
  }

  getTheme() {
    return this.theme;
  }

  setTheme(theme: string) {
    if (this.theme === theme) return;
    this.theme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_monaco_theme', theme);
    }
    this.themeListeners.forEach((lis) => lis(theme));
  }

  getDraft(problemId: string, langId: string): string | null {
    return this.drafts[`${problemId}_${langId}`] || null;
  }

  async setLanguage(lang: string) {
    if (this.currentLanguage === lang) return;
    this.currentLanguage = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_preferred_language', lang);
      this.syncProfileToDb();
    }
    this.langListeners.forEach((lis) => lis(lang));
  }

  setCompareMode(val: boolean) {
    if (this.compareMode === val) return;
    this.compareMode = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_compare_mode', String(val));
    }
    this.compareListeners.forEach((lis) => lis(val));
  }

  async setCareerGoal(goal: string) {
    if (this.careerGoal === goal) return;
    this.careerGoal = goal;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_career_goal', goal);
      this.syncProfileToDb();
    }
    this.careerListeners.forEach((lis) => lis(goal));
  }

  async setExperienceLevel(level: string) {
    if (this.experienceLevel === level) return;
    this.experienceLevel = level;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_experience_level', level);
      this.syncProfileToDb();
    }
    this.levelListeners.forEach((lis) => lis(level));
  }

  async setDisplayName(name: string) {
    if (this.displayName === name) return;
    this.displayName = name;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_display_name', name);
      this.syncProfileToDb();
    }
    this.nameListeners.forEach((lis) => lis(name));
  }

  async setAvatarId(id: string) {
    if (this.avatarId === id) return;
    this.avatarId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_avatar_id', id);
      this.syncProfileToDb();
    }
    this.avatarListeners.forEach((lis) => lis(id));
  }

  setDraft(problemId: string, langId: string, code: string) {
    const key = `${problemId}_${langId}`;
    this.drafts[key] = code;
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_editor_drafts', JSON.stringify(this.drafts));
    }
    this.draftsListeners.forEach((lis) => lis({ ...this.drafts }));
  }

  subscribeLanguage(lis: LanguageListener) {
    this.langListeners.add(lis);
    return () => this.langListeners.delete(lis);
  }

  subscribeCompare(lis: CompareListener) {
    this.compareListeners.add(lis);
    return () => this.compareListeners.delete(lis);
  }

  subscribeDrafts(lis: DraftsListener) {
    this.draftsListeners.add(lis);
    return () => this.draftsListeners.delete(lis);
  }

  subscribeCareer(lis: CareerListener) {
    this.careerListeners.add(lis);
    return () => this.careerListeners.delete(lis);
  }

  subscribeLevel(lis: LevelListener) {
    this.levelListeners.add(lis);
    return () => this.levelListeners.delete(lis);
  }

  subscribeName(lis: NameListener) {
    this.nameListeners.add(lis);
    return () => this.nameListeners.delete(lis);
  }

  subscribeAvatar(lis: AvatarListener) {
    this.avatarListeners.add(lis);
    return () => this.avatarListeners.delete(lis);
  }

  subscribeTheme(lis: (theme: string) => void) {
    this.themeListeners.add(lis);
    return () => this.themeListeners.delete(lis);
  }

  public async syncFromDb() {
    try {
      const { supabase } = await import('@/database/supabaseClient');
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/languages', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.preferred_language) {
          this.currentLanguage = data.preferred_language;
          this.langListeners.forEach((lis) => lis(data.preferred_language));
        }
        if (data.career_goal) {
          this.careerGoal = data.career_goal;
          this.careerListeners.forEach((lis) => lis(data.career_goal));
        }
        if (data.experience_level) {
          this.experienceLevel = data.experience_level;
          this.levelListeners.forEach((lis) => lis(data.experience_level));
        }
        if (data.display_name !== undefined) {
          this.displayName = data.display_name;
          this.nameListeners.forEach((lis) => lis(data.display_name));
        }
        if (data.avatar_id !== undefined) {
          this.avatarId = data.avatar_id;
          this.avatarListeners.forEach((lis) => lis(data.avatar_id));
        }
      }
    } catch (err) {
      console.warn('Could not sync profile from db. Using local state.', err);
    }
  }

  private async syncProfileToDb() {
    try {
      const { supabase } = await import('@/database/supabaseClient');
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      await fetch('/api/languages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          preferred_language: this.currentLanguage,
          career_goal: this.careerGoal,
          experience_level: this.experienceLevel,
          display_name: this.displayName,
          avatar_id: this.avatarId
        })
      });
    } catch (err) {
      console.warn('Could not save profile details to DB.', err);
    }
  }
}

export const languageStore = new LanguageStore();
export default languageStore;
