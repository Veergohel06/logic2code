'use client';

import { useState } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { BrainCircuit, BookOpen, Terminal, Sparkles } from 'lucide-react';

interface LogicBreakdownProps {
  problemId: string;
}

export default function LogicBreakdown({ problemId }: LogicBreakdownProps) {
  const { language } = useLanguage();
  const [activeMode, setActiveMode] = useState<'thinking' | 'algorithm' | 'pseudocode'>('thinking');

  const getBreakdownData = (langId: string) => {
    switch (langId) {
      case 'python':
        return {
          thinking: 'We want to find the maximum value. Since Python is dynamically typed, we do not need to declare types. We can initialize a pointer, scan the array elements, and use Pythonic comparisons. If the input list is empty, we must return None.',
          algorithm: [
            '1. Check if the array is empty -> return None.',
            '2. Initialize a variable "largest" with the value of the first element (index 0).',
            '3. Iterate through each number "n" in the input list.',
            '4. If "n" is greater than "largest", update "largest = n".',
            '5. After loop completes, return "largest".'
          ],
          pseudocode: `FUNCTION find_largest(nums):
    IF nums is empty THEN
        RETURN None
    largest = nums[0]
    FOR EACH num IN nums DO
        IF num > largest THEN
            largest = num
    RETURN largest`
        };
      case 'javascript':
      case 'typescript':
        return {
          thinking: 'We want to traverse the array element by element. In JavaScript, we check if the array is empty or undefined and return null. We can loop using standard indexing or for-of loop and return the largest variable.',
          algorithm: [
            '1. Check if array is null or empty -> return null.',
            '2. Declare a let variable "largest" pointing to index 0.',
            '3. Run a for loop from index 0 to array.length.',
            '4. Compare element at current index: if greater, assign to "largest".',
            '5. Return the "largest" value.'
          ],
          pseudocode: `FUNCTION findLargest(nums) {
    IF nums is empty or null THEN
        RETURN null
    largest = nums[0]
    FOR i FROM 0 TO nums.length - 1 DO
        IF nums[i] > largest THEN
            largest = nums[i]
    RETURN largest
}`
        };
      case 'java':
        return {
          thinking: 'We declare a static method that returns a nullable Integer class. We need to handle null-pointer checks first. We initialize our local tracking variable and loop through the collection using an enhanced for-loop.',
          algorithm: [
            '1. Guard clause: Check if array is null or length is zero -> return null.',
            '2. Declare local variable "largest" and assign array[0].',
            '3. Iterate each int "n" in the array.',
            '4. If "n" exceeds "largest", update "largest".',
            '5. Return the wrapper Integer "largest".'
          ],
          pseudocode: `METHOD findLargest(int[] nums):
    IF nums is null OR nums.length is 0 THEN
        RETURN null
    largest = nums[0]
    FOR EACH n IN nums DO
        IF n > largest THEN
            largest = n
    RETURN largest`
        };
      case 'cpp':
      case 'c':
        return {
          thinking: 'We must return a std::optional wrapper to safely convey the absence of a value for empty lists. We pass the vector by constant reference to avoid heap copy overheads.',
          algorithm: [
            '1. Check vector.empty() -> return std::nullopt.',
            '2. Declare "largest" as int matching vector[0].',
            '3. Range-based for loop to check values.',
            '4. Update largest when value exceeds current.',
            '5. Return largest encapsulated in std::optional.'
          ],
          pseudocode: `FUNCTION findLargest(const vector<int>& nums):
    IF nums.empty() THEN
        RETURN nullopt
    largest = nums[0]
    FOR EACH n IN nums DO
        IF n > largest THEN
            largest = n
    RETURN largest`
        };
      case 'go':
        return {
          thinking: 'We check for slice length and handle goroutine channel sync as job workers process. The local helper scans items linear-time.',
          algorithm: [
            '1. Check slice length == 0 -> return zero-value / empty.',
            '2. Initialise variable "largest" to index 0.',
            '3. Iterate indices of slice using range keywords.',
            '4. Compare and assign new largest.',
            '5. Return value.'
          ],
          pseudocode: `FUNC solveProblem(data string) []string:
    IF slice is empty THEN
        RETURN empty slice
    largest = slice[0]
    FOR index, val RANGE slice DO
        IF val > largest THEN
            largest = val
    RETURN largest`
        };
      default:
        return {
          thinking: 'Linear traversal search logic.',
          algorithm: ['Iterate array.', 'Compare and store max.'],
          pseudocode: 'FUNCTION find_max(arr): ...'
        };
    }
  };

  const data = getBreakdownData(language);

  return (
    <div className="glass-spatial rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-950/40 border border-indigo-900/30 flex items-center justify-center text-indigo-400">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Solve With Me
          </span>
          <span className="text-sm font-extrabold text-white uppercase tracking-wide">
            Logic Decomposition
          </span>
        </div>
      </div>

      {/* Modes */}
      <div className="flex bg-white/5 p-1 border border-white/10 rounded-2xl mb-4">
        {(['thinking', 'algorithm', 'pseudocode'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeMode === mode
                ? 'bg-indigo-650 text-white shadow-sm border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Display Box */}
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 min-h-36 flex flex-col justify-center">
        {activeMode === 'thinking' && (
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-slate-300 leading-relaxed">
              {data.thinking}
            </span>
          </div>
        )}

        {activeMode === 'algorithm' && (
          <div className="flex flex-col gap-2 font-mono text-[11px] text-slate-300 font-medium">
            {data.algorithm.map((step, idx) => (
              <span key={idx}>{step}</span>
            ))}
          </div>
        )}

        {activeMode === 'pseudocode' && (
          <pre className="text-[10.5px] font-mono text-indigo-400 leading-relaxed overflow-x-auto select-all">
            <code>{data.pseudocode}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
