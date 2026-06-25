export interface AchievementConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  languageId: string | 'global';
  xpReward: number;
}

export const ACHIEVEMENTS: AchievementConfig[] = [
  // Global
  { id: 'polyglot', title: 'Multilingual Polyglot', description: 'Switch and solve coding problems in 3 different languages.', icon: 'globe', languageId: 'global', xpReward: 500 },
  { id: 'streak-7', title: 'Logic Builder Streak', description: 'Maintain a 7-day coding streak on the platform.', icon: 'zap', languageId: 'global', xpReward: 300 },
  { id: 'logic-pioneer', title: 'Logic Pioneer', description: 'Solve your first problem using the Logic Breakdown visualizer.', icon: 'compass', languageId: 'global', xpReward: 100 },

  // Python
  { id: 'py-tamer', title: 'PyTamer', description: 'Complete Python variables, inputs, and functions.', icon: 'snake', languageId: 'python', xpReward: 200 },
  { id: 'indentation-pro', title: 'Indentation Pro', description: 'Complete a complex Python logic flow with no syntax errors.', icon: 'align-left', languageId: 'python', xpReward: 150 },
  { id: 'pythonic-thinker', title: 'Pythonic Thinker', description: 'Solve a dictionary and list-comprehension problem.', icon: 'brain', languageId: 'python', xpReward: 250 },

  // JavaScript
  { id: 'event-loop', title: 'Event Loop Rider', description: 'Complete JavaScript Async programming roadmap step.', icon: 'refresh-cw', languageId: 'javascript', xpReward: 200 },
  { id: 'dom-conqueror', title: 'DOM Conqueror', description: 'Solve a browser document flow simulation without refresh.', icon: 'layout', languageId: 'javascript', xpReward: 150 },
  { id: 'async-ace', title: 'Async Ace', description: 'Solve 3 problems involving API data and async logic.', icon: 'clock', languageId: 'javascript', xpReward: 250 },

  // Java
  { id: 'oop-architect', title: 'OOP Architect', description: 'Design and build class-based logic in Java.', icon: 'box', languageId: 'java', xpReward: 250 },
  { id: 'collection-collector', title: 'Collection Collector', description: 'Use ArrayList and HashMap to complete Java DSA problems.', icon: 'database', languageId: 'java', xpReward: 200 },
  { id: 'thread-conductor', title: 'Thread Conductor', description: 'Learn multithreading and solve thread-synchronization problems.', icon: 'git-branch', languageId: 'java', xpReward: 300 },

  // C++
  { id: 'pointer-master', title: 'Pointer Pointer Pointer', description: 'Manipulate memory addresses and pass-by-reference.', icon: 'arrow-up-right', languageId: 'cpp', xpReward: 300 },
  { id: 'stack-savior', title: 'Stack Savior', description: 'Understand stack vs heap layout in memory visualization.', icon: 'layers', languageId: 'cpp', xpReward: 200 },
  { id: 'stl-synthesizer', title: 'STL Synthesizer', description: 'Solve vectors, maps, and templates exercises.', icon: 'package', languageId: 'cpp', xpReward: 250 },

  // Go
  { id: 'goroutine-pilot', title: 'Goroutine Pilot', description: 'Fire your first asynchronous light-weight thread.', icon: 'wind', languageId: 'go', xpReward: 200 },
  { id: 'channel-surfer', title: 'Channel Surfer', description: 'Coordinate safe data exchange between goroutines via channels.', icon: 'activity', languageId: 'go', xpReward: 250 },
  { id: 'gopher-concurrency', title: 'Gopher Concurrency', description: 'Resolve channel deadlock and use Select blocks.', icon: 'shield', languageId: 'go', xpReward: 300 }
];
