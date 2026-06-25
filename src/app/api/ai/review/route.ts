import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized. Valid auth token required.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { selected_language, code, problemId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code snippet parameter is required.' }, { status: 400 });
    }

    if (code.length > 8000) {
      return NextResponse.json({ error: 'Code size limit exceeded (Max 8000 characters).' }, { status: 400 });
    }

    const lang = (selected_language || 'python').toLowerCase();
    let reviewText = 'Your logic looks clean and well-structured. No critical issues found.';
    let timeComplexity = 'O(N)';
    let timeReason = 'Iterates through the data sequence exactly once.';
    let spaceComplexity = 'O(1)';
    let spaceReason = 'Allocates a constant number of control variables.';
    let annotations: any[] = [];
    let alternativeCode = '';

    if (lang === 'python') {
      reviewText = 'Highly readable code. Excellent use of Pythonic iteration and clean indentation structure.';
      timeComplexity = 'O(N)';
      timeReason = 'Iterates through the input nums list of length N exactly once.';
      spaceComplexity = 'O(1)';
      spaceReason = 'Only a few scalar variables (largest, n) are allocated on the stack.';
      annotations = [
        {
          line: 3,
          type: 'warning',
          message: 'Potential IndexError: Indexing nums[0] directly before checking if the list is empty.'
        },
        {
          line: 4,
          type: 'info',
          message: 'Pythonic tip: You could use the built-in max() function for a more concise solution.'
        }
      ];
      alternativeCode = `def solve_problem(nums):\n    if not nums:\n        return 0\n    return max(nums)`;
    } else if (lang === 'r') {
      reviewText = 'R-native vector solution. Good utilization of indexing checks.';
      timeComplexity = 'O(N)';
      timeReason = 'The max() function reads all elements of the vector.';
      spaceComplexity = 'O(N)';
      spaceReason = 'R vectors are copied in memory context operations.';
      annotations = [
        {
          line: 2,
          type: 'warning',
          message: 'Ensure you verify length(nums) > 0 before calling max() to avoid warnings.'
        },
        {
          line: 3,
          type: 'info',
          message: 'Use na.rm = TRUE in max() if your dataset contains missing (NA) values.'
        }
      ];
      alternativeCode = `solve_problem <- function(nums) {\n  if (length(nums) == 0) return(0)\n  max(nums, na.rm = TRUE)\n}`;
    } else if (lang === 'javascript' || lang === 'typescript') {
      reviewText = 'JavaScript loop runs correctly. Scoping is modern and blocks are clean.';
      timeComplexity = 'O(N)';
      timeReason = 'Linear iteration using standard for-of loop over array elements.';
      spaceComplexity = 'O(1)';
      spaceReason = 'No dynamically sizing auxiliary data structures are declared.';
      annotations = [
        {
          line: 3,
          type: 'warning',
          message: 'TypeError Prevention: Check if nums is null or nums.length === 0 before referencing index 0.'
        },
        {
          line: 4,
          type: 'info',
          message: 'Functional tip: Consider using Array.prototype.reduce() to write a zero-mutation solution.'
        }
      ];
      alternativeCode = `function solveProblem(nums) {\n  if (!nums || nums.length === 0) return 0;\n  return Math.max(...nums);\n}`;
    } else if (lang === 'java') {
      reviewText = 'Java method is correctly encapsulated. Good static declaration.';
      timeComplexity = 'O(N)';
      timeReason = 'Enhanced for-loop visits each integer in the array exactly once.';
      spaceComplexity = 'O(1)';
      spaceReason = 'Only primitive int references are allocated on the stack.';
      annotations = [
        {
          line: 4,
          type: 'warning',
          message: 'NullPointerException risk: Check if nums == null before checking nums.length.'
        },
        {
          line: 5,
          type: 'info',
          message: 'Performance tip: Returning primitive int prevents unnecessary box wrapper overhead.'
        }
      ];
      alternativeCode = `public static int solveProblem(int[] nums) {\n    if (nums == null || nums.length == 0) {\n        return 0;\n    }\n    int largest = nums[0];\n    for (int n : nums) {\n        if (n > largest) largest = n;\n    }\n    return largest;\n}`;
    } else if (lang === 'cpp' || lang === 'c') {
      reviewText = 'Excellent constant reference parameter optimization, which prevents vector copying overhead.';
      timeComplexity = 'O(N)';
      timeReason = 'Standard loop scans sequence of N elements linearly.';
      spaceComplexity = 'O(1)';
      spaceReason = 'Uses constant local references only; no dynamic heap allocations.';
      annotations = [
        {
          line: 5,
          type: 'warning',
          message: 'Segmentation Fault risk: Verify that nums.size() > 0 before accessing nums[0].'
        },
        {
          line: 6,
          type: 'info',
          message: 'STL tip: You can use std::max_element from <algorithm> to write idiomatic C++.'
        }
      ];
      alternativeCode = `#include <vector>\n#include <algorithm>\n\nint solveProblem(const std::vector<int>& nums) {\n    if (nums.empty()) return 0;\n    return *std::max_element(nums.begin(), nums.end());\n}`;
    } else if (lang === 'go') {
      reviewText = 'Clean Go slice iteration. Matches standard conventions.';
      timeComplexity = 'O(N)';
      timeReason = 'Slice elements are evaluated sequentially.';
      spaceComplexity = 'O(1)';
      spaceReason = 'No stack-allocated references escape to the garbage-collected heap.';
      annotations = [
        {
          line: 2,
          type: 'warning',
          message: 'Index panic: Ensure len(nums) > 0 before reading index 0.'
        },
        {
          line: 3,
          type: 'info',
          message: 'Go Tip: Consider returning (int, error) if empty slices represent an error condition.'
        }
      ];
      alternativeCode = `func solveProblem(nums []int) int {\n\tif len(nums) == 0 {\n\t\treturn 0\n\t}\n\tmax := nums[0]\n\tfor _, n := range nums {\n\t\tif n > max {\n\t\t\tmax = n\n\t\t}\n\t}\n\treturn max\n}`;
    }

    return NextResponse.json({
      review: reviewText,
      complexity: {
        time: timeComplexity,
        timeReason: timeReason,
        space: spaceComplexity,
        spaceReason: spaceReason
      },
      annotations: annotations,
      alternativeCode: alternativeCode,
      metadata: {
        selected_language: selected_language,
        problemId: problemId
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process AI review request' }, { status: 500 });
  }
}
