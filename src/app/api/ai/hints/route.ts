import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selected_language, problemId } = body;

    const lang = (selected_language || 'python').toLowerCase();
    
    let hints = [
      'Initialize a pointer or variable to track the maximum/matching value.',
      'Loop through the collection and compare each element to your tracker.',
      'Return the final tracked value after the loop completes.'
    ];

    if (lang === 'python') {
      hints = [
        'Check if the list is empty first using "if not nums: return None". This prevents index errors.',
        'Initialize your "largest" tracker to the first element "nums[0]".',
        'Use a simple "for n in nums:" loop to traverse. Pythonic traversal does not need manual indexes!'
      ];
    } else if (lang === 'javascript' || lang === 'typescript') {
      hints = [
        'Ensure you check if the array is null or undefined: "if (!nums || nums.length === 0)".',
        'Use "let largest = nums[0]" rather than "var" to maintain block scoping.',
        'Consider using functional operations like Array.prototype.reduce() as an advanced implementation!'
      ];
    } else if (lang === 'java') {
      hints = [
        'Java uses wrapper objects like Integer to allow null return values for empty arrays.',
        'Use a guard clause: "if (nums == null || nums.length == 0) return null;"',
        'An enhanced for-loop "for (int n : nums)" is the cleanest way to iterate the array.'
      ];
    } else if (lang === 'cpp' || lang === 'c') {
      hints = [
        'C++ passes parameters by const reference: "const vector<int>& nums" to optimize performance.',
        'Check if vector is empty: "if (nums.empty()) return std::nullopt;".',
        'Use std::optional to handle empty case safely without throwing segfault errors.'
      ];
    } else if (lang === 'go') {
      hints = [
        'In Go, verify the slice length first using len(nums).',
        'Initialize the maximum variable, then use "for index, value := range nums" to iterate.',
        'Return the value directly. Keep assignments short with ":=".'
      ];
    }

    return NextResponse.json({
      hints: hints,
      metadata: {
        selected_language: selected_language,
        problemId: problemId
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process AI hints request' }, { status: 500 });
  }
}
