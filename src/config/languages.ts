export interface LanguageConfig {
  id: string;
  name: string;
  monacoLang: string;
  isFuture?: boolean;
  fileExtension: string;
  defaultCode: string;
  visualizerType: 'list-dict' | 'event-loop' | 'pointers-heap' | 'oop-heap' | 'concurrency';
  color: string;
  description: string;
}

export const LANGUAGES: LanguageConfig[] = [
  {
    id: 'python',
    name: 'Python',
    monacoLang: 'python',
    fileExtension: 'py',
    defaultCode: `# Write your Python logic here\ndef solve_problem(data):\n    # TODO: Implement your solution\n    result = []\n    print("Processing:", data)\n    return result\n\n# Run simulation\nsolve_problem("hello world")\n`,
    visualizerType: 'list-dict',
    color: 'from-blue-500 to-yellow-500',
    description: 'Focus on readability, clean syntax, and Pythonic patterns.'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    monacoLang: 'javascript',
    fileExtension: 'js',
    defaultCode: `// Write your JavaScript logic here\nfunction solveProblem(data) {\n    // TODO: Implement your solution\n    console.log("Processing:", data);\n    const result = [];\n    return result;\n}\n\n// Run simulation\nsolveProblem("hello world");\n`,
    visualizerType: 'event-loop',
    color: 'from-yellow-400 to-amber-500',
    description: 'Learn asynchronous programming, closures, and DOM manipulation.'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    monacoLang: 'typescript',
    fileExtension: 'ts',
    defaultCode: `// Write your TypeScript logic here\ninterface DataInput {\n    text: string;\n}\n\nfunction solveProblem(data: DataInput): string[] {\n    // TODO: Implement your solution\n    console.log("Processing:", data.text);\n    return [data.text];\n}\n\n// Run simulation\nsolveProblem({ text: "hello world" });\n`,
    visualizerType: 'event-loop',
    color: 'from-blue-600 to-sky-400',
    description: 'Strict type safety, interfaces, and advanced Javascript features.'
  },
  {
    id: 'java',
    name: 'Java',
    monacoLang: 'java',
    fileExtension: 'java',
    defaultCode: `// Write your Java logic here\nimport java.util.*;\n\npublic class Solution {\n    public static List<String> solveProblem(String data) {\n        // TODO: Implement your solution\n        System.out.println("Processing: " + data);\n        List<String> result = new ArrayList<>();\n        return result;\n    }\n\n    public static void main(String[] args) {\n        solveProblem("hello world");\n    }\n}\n`,
    visualizerType: 'oop-heap',
    color: 'from-orange-500 to-red-600',
    description: 'Master classes, objects, multithreading, and strong OOP principles.'
  },
  {
    id: 'cpp',
    name: 'C++',
    monacoLang: 'cpp',
    fileExtension: 'cpp',
    defaultCode: `// Write your C++ logic here\n#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nvector<string> solveProblem(string data) {\n    // TODO: Implement your solution\n    cout << "Processing: " << data << endl;\n    vector<string> result;\n    return result;\n}\n\nint main() {\n    solveProblem("hello world");\n    return 0;\n}\n`,
    visualizerType: 'pointers-heap',
    color: 'from-blue-700 to-indigo-600',
    description: 'Understand low-level memory layout, stack vs heap, STL, and pointers.'
  },
  {
    id: 'c',
    name: 'C',
    monacoLang: 'c',
    fileExtension: 'c',
    defaultCode: `// Write your C logic here\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nvoid solveProblem(char* data) {\n    // TODO: Implement your solution\n    printf("Processing: %s\\n", data);\n}\n\nint main() {\n    solveProblem("hello world");\n    return 0;\n}\n`,
    visualizerType: 'pointers-heap',
    color: 'from-slate-600 to-slate-800',
    description: 'Procedural logic, structures, manual memory management, and pointers.'
  },
  {
    id: 'go',
    name: 'Go',
    monacoLang: 'go',
    fileExtension: 'go',
    defaultCode: `// Write your Go logic here\npackage main\n\nimport "fmt"\n\nfunc solveProblem(data string) []string {\n    // TODO: Implement your solution\n    fmt.Println("Processing:", data)\n    return []string{}\n}\n\nfunc main() {\n    solveProblem("hello world")\n}\n`,
    visualizerType: 'concurrency',
    color: 'from-cyan-500 to-teal-400',
    description: 'Learn concurrent programming with goroutines, channels, and simple structures.'
  },
  {
    id: 'r',
    name: 'R',
    monacoLang: 'r',
    fileExtension: 'r',
    defaultCode: `# Write your R data analysis logic here\nsolve_problem <- function(data) {\n  # TODO: Implement your solution\n  print(paste("Processing:", data))\n  result <- list()\n  return(result)\n}\n\n# Run simulation\nsolve_problem("hello world")\n`,
    visualizerType: 'list-dict',
    color: 'from-blue-400 to-indigo-500',
    description: 'Learn statistical computing, data analysis, dataframes, and plotting in R.'
  },
  {
    id: 'rust',
    name: 'Rust',
    monacoLang: 'rust',
    fileExtension: 'rs',
    isFuture: true,
    defaultCode: `// Future Feature: Rust Support\nfn main() {\n    println!("Rust learning roadmap is coming soon!");\n}\n`,
    visualizerType: 'pointers-heap',
    color: 'from-amber-700 to-amber-900',
    description: 'High performance, safe concurrency, and strict ownership rules (Coming Soon).'
  },
  {
    id: 'php',
    name: 'PHP',
    monacoLang: 'php',
    fileExtension: 'php',
    isFuture: true,
    defaultCode: `<?php\n// Future Feature: PHP Support\necho "PHP learning roadmap is coming soon!";\n`,
    visualizerType: 'list-dict',
    color: 'from-purple-600 to-indigo-500',
    description: 'Server-side scripting and web application development (Coming Soon).'
  }
];
