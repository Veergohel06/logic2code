'use client';

import { useState } from 'react';
import { Files, AlertCircle, Sparkles, Terminal } from 'lucide-react';

interface CompareLanguagesPanelProps {
  problemId: string;
}

export default function CompareLanguagesPanel({ problemId }: CompareLanguagesPanelProps) {
  const [activeTab, setActiveTab] = useState<'python' | 'javascript' | 'java' | 'cpp'>('python');

  // Hardcoded comparison data matching the problem examples from the requirements
  const getComparisonData = (probId: string) => {
    return {
      python: `def find_largest(nums):
    if not nums:
        return None
    largest = nums[0]
    for n in nums:
        if n > largest:
            largest = n
    return largest`,
      javascript: `function findLargest(nums) {
    if (!nums || nums.length === 0) {
        return null;
      }
    let largest = nums[0];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > largest) {
            largest = nums[i];
        }
    }
    return largest;
}`,
      java: `public class Solution {
    public static Integer findLargest(int[] nums) {
        if (nums == null || nums.length == 0) {
            return null;
        }
        int largest = nums[0];
        for (int n : nums) {
            if (n > largest) {
                largest = n;
            }
        }
        return largest;
    }
}`,
      cpp: `#include <vector>
#include <optional>

std::optional<int> findLargest(const std::vector<int>& nums) {
    if (nums.empty()) {
        return std::nullopt;
    }
    int largest = nums[0];
    for (int n : nums) {
        if (n > largest) {
            largest = n;
        }
    }
    return largest;
}`,
      syntaxDiffs: [
        'Python uses indentation blocks and is dynamically typed. C++ and Java require strict type signatures.',
        'C++ uses std::optional to handle null cases safely; Java uses Integer (nullable object reference); JS uses null; Python uses None.',
        'JavaScript allows array access dynamically, whereas Java array sizes are static at runtime.'
      ],
      logicSimilarities: [
        'All solutions follow the same O(N) linear scan template: initializing a pointer to the first item, iterating the collection, and saving the max item.',
        'Base cases are identical: returning empty/null indicators for empty arrays.'
      ],
      performanceNotes: [
        'C++: Runs fastest due to static compiling, zero-overhead std::vector traversal, and cache-locality.',
        'Java: Runs in JVM. High heap memory utilization for objects, but JIT compiling optimizes loop iterations.',
        'Python: Slowest interpreter traversal, but highly readable and compact.',
        'JS: Runs inside Chrome V8 engine. JIT optimizations keep array lookups fast.'
      ]
    };
  };

  const data = getComparisonData(problemId);

  return (
    <div className="glass-spatial rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Files className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-extrabold text-white uppercase tracking-wide">
            Compare Languages Mode
          </span>
        </div>
        <span className="text-[10px] text-blue-400 font-bold border border-blue-900/30 px-2 py-0.5 rounded bg-blue-950/40 uppercase tracking-wider">
          Polyglot Helper
        </span>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1.5 border border-white/10 rounded-2xl">
        {(['python', 'javascript', 'java', 'cpp'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer capitalize ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'cpp' ? 'C++' : tab}
          </button>
        ))}
      </div>

      {/* Code Snippet Window */}
      <div className="bg-slate-950/60 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
        <div className="bg-slate-900/60 px-4 py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono border-b border-white/10">
          Equivalent {activeTab === 'cpp' ? 'C++' : activeTab} Solution
        </div>
        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-56 custom-scrollbar select-all">
          <code>{data[activeTab]}</code>
        </pre>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Syntax Differences */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Syntax Differences</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-300 font-semibold leading-relaxed">
            {data.syntaxDiffs.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>

        {/* Logic Similarities */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Logic Similarities</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-300 font-semibold leading-relaxed">
            {data.logicSimilarities.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>

        {/* Performance Notes */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>Performance Notes</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-300 font-semibold leading-relaxed">
            {data.performanceNotes.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
