export interface ProblemConfig {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium';
  description: string;
  constraints: string[];
  inputSpec: string;
  outputSpec: string;
  languageId: string;
}

export const PROBLEMS: Record<string, ProblemConfig[]> = {
  python: [
    {
      id: 'py-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
      inputSpec: 'nums: List[int], target: int',
      outputSpec: 'List[int] - Indices of the two numbers.',
      languageId: 'python'
    },
    {
      id: 'py-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string containing just brackets characters, determine if the input string is valid based on parentheses closure rules.',
      constraints: ['1 <= s.length <= 10^4', 's consists of brackets only.'],
      inputSpec: 's: str',
      outputSpec: 'bool - True if valid, False otherwise.',
      languageId: 'python'
    },
    {
      id: 'py-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit.',
      constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
      inputSpec: 'prices: List[int]',
      outputSpec: 'int - Max profit.',
      languageId: 'python'
    },
    {
      id: 'py-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list head pointer.',
      constraints: ['The number of nodes in the list is in the range [0, 5000].', '-5000 <= Node.val <= 5000'],
      inputSpec: 'head: Optional[ListNode]',
      outputSpec: 'Optional[ListNode] - Head of the reversed list.',
      languageId: 'python'
    },
    {
      id: 'py-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists list1 and list2 into one sorted list by splicing together the nodes.',
      constraints: ['The number of nodes in both lists is [0, 50].', 'Both lists are sorted.'],
      inputSpec: 'list1: Optional[ListNode], list2: Optional[ListNode]',
      outputSpec: 'Optional[ListNode] - Head of the merged sorted list.',
      languageId: 'python'
    },
    {
      id: 'py-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'n: int',
      outputSpec: 'int - Distinct paths to reach the top.',
      languageId: 'python'
    },
    {
      id: 'py-largest',
      title: 'Find Largest Number',
      difficulty: 'Easy',
      description: 'Write a function that accepts an array of numbers and returns the largest value in the collection.',
      constraints: ['Time Complexity: O(N)', 'Space Complexity: O(1)', 'Array length <= 10^5'],
      inputSpec: 'nums: List[int] - A list of integers.',
      outputSpec: 'int - The largest integer in the list.',
      languageId: 'python'
    },
    {
      id: 'py-vowels',
      title: 'Count Vowels',
      difficulty: 'Easy',
      description: 'Given a string, write a Pythonic function to count the number of vowels (a, e, i, o, u) present, case-insensitively.',
      constraints: ['String length <= 10^4'],
      inputSpec: 'text: str - A string value.',
      outputSpec: 'int - Count of vowels.',
      languageId: 'python'
    },
    {
      id: 'py-csv',
      title: 'CSV Data Analysis',
      difficulty: 'Medium',
      description: 'Read a simulated comma-separated string representing user record fields and calculate the average grade of active students.',
      constraints: ['Output average grade rounded to 2 decimal places.'],
      inputSpec: 'csv_data: str - Multi-line CSV string.',
      outputSpec: 'float - Average grade of active students.',
      languageId: 'python'
    }
  ],
  javascript: [
    {
      id: 'js-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
      inputSpec: 'nums: number[], target: number',
      outputSpec: 'number[] - Indices of the two numbers.',
      languageId: 'javascript'
    },
    {
      id: 'js-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string containing just brackets characters, determine if the input string is valid.',
      constraints: ['1 <= s.length <= 10^4'],
      inputSpec: 's: string',
      outputSpec: 'boolean',
      languageId: 'javascript'
    },
    {
      id: 'js-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
      constraints: ['1 <= prices.length <= 10^5'],
      inputSpec: 'prices: number[]',
      outputSpec: 'number - Max profit.',
      languageId: 'javascript'
    },
    {
      id: 'js-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list head.',
      constraints: ['The number of nodes in the list is [0, 5000].'],
      inputSpec: 'head: ListNode',
      outputSpec: 'ListNode - Head of the reversed list.',
      languageId: 'javascript'
    },
    {
      id: 'js-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists list1 and list2 into one sorted list by splicing together the nodes.',
      constraints: ['The number of nodes in both lists is [0, 50].'],
      inputSpec: 'list1: ListNode, list2: ListNode',
      outputSpec: 'ListNode - Head of the merged sorted list.',
      languageId: 'javascript'
    },
    {
      id: 'js-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'n: number',
      outputSpec: 'number - Distinct paths to reach the top.',
      languageId: 'javascript'
    },
    {
      id: 'js-array',
      title: 'Array Manipulation',
      difficulty: 'Easy',
      description: 'Write a JavaScript helper function to remove duplicates from an array and filter out odd numbers using array methods.',
      constraints: ['Use functional array operations (filter, map).'],
      inputSpec: 'arr: Array<number>',
      outputSpec: 'Array<number> - Cleaned array containing unique even integers.',
      languageId: 'javascript'
    },
    {
      id: 'js-todo',
      title: 'Todo Application Logic',
      difficulty: 'Medium',
      description: 'Write the state reducer function for adding, editing, and deleting items from a Todo items list store.',
      constraints: ['State must be immutable.', 'Support TOGGLE_COMPLETE and ADD_TODO action tags.'],
      inputSpec: 'state: Array<Object>, action: Object',
      outputSpec: 'Array<Object> - Next immutable state.',
      languageId: 'javascript'
    }
  ],
  typescript: [
    {
      id: 'ts-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
      inputSpec: 'nums: number[], target: number',
      outputSpec: 'number[] - Indices of the two numbers.',
      languageId: 'typescript'
    },
    {
      id: 'ts-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string containing brackets, determine if the input string is valid using type-safe structure.',
      constraints: ['s consists of parentheses characters only.'],
      inputSpec: 's: string',
      outputSpec: 'boolean',
      languageId: 'typescript'
    },
    {
      id: 'ts-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'Optimize stock buy/sell profit transaction utilizing type-safe inputs.',
      constraints: ['prices consists of non-negative integers.'],
      inputSpec: 'prices: number[]',
      outputSpec: 'number',
      languageId: 'typescript'
    },
    {
      id: 'ts-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list head.',
      constraints: ['The list node values are bounded integers.'],
      inputSpec: 'head: ListNode | null',
      outputSpec: 'ListNode | null',
      languageId: 'typescript'
    },
    {
      id: 'ts-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists into one sorted list.',
      constraints: ['Nodes are sorted in non-decreasing order.'],
      inputSpec: 'list1: ListNode | null, list2: ListNode | null',
      outputSpec: 'ListNode | null',
      languageId: 'typescript'
    },
    {
      id: 'ts-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'In how many distinct ways can you climb to the top of n stairs?',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'n: number',
      outputSpec: 'number',
      languageId: 'typescript'
    },
    {
      id: 'ts-user-profile',
      title: 'User Profile Validation',
      difficulty: 'Easy',
      description: 'Define a User interface and write a type-safe function to validate that name is non-empty and email contains an @ sign.',
      constraints: ['TypeScript interface declarations', 'String validation logic'],
      inputSpec: 'user: User - The user object to validate.',
      outputSpec: 'boolean - True if valid, false otherwise.',
      languageId: 'typescript'
    }
  ],
  java: [
    {
      id: 'java-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= nums.length <= 10^4', 'Only one valid answer exists.'],
      inputSpec: 'int[] nums, int target',
      outputSpec: 'int[] - Indices of the two numbers.',
      languageId: 'java'
    },
    {
      id: 'java-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string s containing brackets, determine if the input string is valid.',
      constraints: ['1 <= s.length() <= 10^4'],
      inputSpec: 'String s',
      outputSpec: 'boolean',
      languageId: 'java'
    },
    {
      id: 'java-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'Find the maximum profit you can achieve from a single buy and sell transaction.',
      constraints: ['prices.length >= 1'],
      inputSpec: 'int[] prices',
      outputSpec: 'int',
      languageId: 'java'
    },
    {
      id: 'java-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Given the head of a singly linked list, reverse the list and return it.',
      constraints: ['The number of nodes is [0, 5000].'],
      inputSpec: 'ListNode head',
      outputSpec: 'ListNode',
      languageId: 'java'
    },
    {
      id: 'java-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists into one sorted list.',
      constraints: ['Both lists are sorted in non-decreasing order.'],
      inputSpec: 'ListNode list1, ListNode list2',
      outputSpec: 'ListNode',
      languageId: 'java'
    },
    {
      id: 'java-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'In how many distinct ways can you climb to the top of n stairs?',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'int n',
      outputSpec: 'int',
      languageId: 'java'
    },
    {
      id: 'java-bank',
      title: 'Bank Account System',
      difficulty: 'Easy',
      description: 'Design a BankAccount class with synchronized methods deposit() and withdraw() to prevent race conditions during transaction runs.',
      constraints: ['All instance fields must be private.', 'Implement deposit/withdraw methods.'],
      inputSpec: 'Class initialization parameters.',
      outputSpec: 'BankAccount object.',
      languageId: 'java'
    },
    {
      id: 'java-library',
      title: 'Library Management',
      difficulty: 'Medium',
      description: 'Create a Library controller that manages a collection of Book objects using a HashMap for fast ISBN lookups.',
      constraints: ['ISBN must map as key.', 'Include getBookByISBN() and addBook() methods.'],
      inputSpec: 'ISBN string, book details.',
      outputSpec: 'Book object or status indicator.',
      languageId: 'java'
    }
  ],
  cpp: [
    {
      id: 'cpp-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= nums.size() <= 10^4'],
      inputSpec: 'std::vector<int>& nums, int target',
      outputSpec: 'std::vector<int>',
      languageId: 'cpp'
    },
    {
      id: 'cpp-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string s containing brackets, determine if the input string is valid.',
      constraints: ['1 <= s.length() <= 10^4'],
      inputSpec: 'std::string s',
      outputSpec: 'bool',
      languageId: 'cpp'
    },
    {
      id: 'cpp-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'Find the maximum profit from buying and selling a stock.',
      constraints: ['prices vector length >= 1'],
      inputSpec: 'std::vector<int>& prices',
      outputSpec: 'int',
      languageId: 'cpp'
    },
    {
      id: 'cpp-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Reverse a singly linked list and return the new head pointer.',
      constraints: ['Linked list iteration or recursion.'],
      inputSpec: 'ListNode* head',
      outputSpec: 'ListNode*',
      languageId: 'cpp'
    },
    {
      id: 'cpp-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists.',
      constraints: ['Non-decreasing values order.'],
      inputSpec: 'ListNode* list1, ListNode* list2',
      outputSpec: 'ListNode*',
      languageId: 'cpp'
    },
    {
      id: 'cpp-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'Calculate the distinct ways to climb n stairs.',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'int n',
      outputSpec: 'int',
      languageId: 'cpp'
    },
    {
      id: 'cpp-numbers',
      title: 'Number Operations',
      difficulty: 'Easy',
      description: 'Write a C++ program that reads integers from standard input and counts occurrences of prime numbers using vectors.',
      constraints: ['Optimized trial division algorithms for prime checking.'],
      inputSpec: 'std::vector<int>',
      outputSpec: 'int - Count of prime numbers.',
      languageId: 'cpp'
    },
    {
      id: 'cpp-stl',
      title: 'STL Challenges',
      difficulty: 'Medium',
      description: 'Use std::map and std::set to count the frequency of unique words in a string, ignoring case and punctuation.',
      constraints: ['Avoid external libraries.', 'Use STL collections.'],
      inputSpec: 'std::string',
      outputSpec: 'std::map<std::string, int> - Frequencies map.',
      languageId: 'cpp'
    }
  ],
  go: [
    {
      id: 'go-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= len(nums) <= 10^4'],
      inputSpec: 'nums []int, target int',
      outputSpec: '[]int',
      languageId: 'go'
    },
    {
      id: 'go-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string s containing brackets, determine if the input string is valid.',
      constraints: ['1 <= len(s) <= 10^4'],
      inputSpec: 's string',
      outputSpec: 'bool',
      languageId: 'go'
    },
    {
      id: 'go-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'Find maximum stock profit from transaction arrays.',
      constraints: ['len(prices) >= 1'],
      inputSpec: 'prices []int',
      outputSpec: 'int',
      languageId: 'go'
    },
    {
      id: 'go-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Given the head of a singly linked list, reverse it and return the new head.',
      constraints: ['Pointer manipulations in Go.'],
      inputSpec: 'head *ListNode',
      outputSpec: '*ListNode',
      languageId: 'go'
    },
    {
      id: 'go-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists.',
      constraints: ['Lists elements are in sorted order.'],
      inputSpec: 'list1 *ListNode, list2 *ListNode',
      outputSpec: '*ListNode',
      languageId: 'go'
    },
    {
      id: 'go-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'Count distinct paths to climb n stairs.',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'n int',
      outputSpec: 'int',
      languageId: 'go'
    },
    {
      id: 'go-goroutines',
      title: 'Goroutine Basics',
      difficulty: 'Easy',
      description: 'Spawn a goroutine that prints out a greeting message. Use a channel to synchronize and block the main function thread until printed.',
      constraints: ['Must use unbuffered channels.', 'Main process must not exit prematurely.'],
      inputSpec: 'None',
      outputSpec: 'Console prints "Hello Gopher!".',
      languageId: 'go'
    },
    {
      id: 'go-concurrent',
      title: 'Concurrent Task Processing',
      difficulty: 'Medium',
      description: 'Write a concurrent task runner that processes an array of jobs using a pool of workers. Distribute tasks via channels.',
      constraints: ['Control concurrency limits.', 'Ensure all tasks finish before exiting.'],
      inputSpec: 'jobs []Job, workers int',
      outputSpec: 'results []Result',
      languageId: 'go'
    }
  ],
  c: [
    {
      id: 'c-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= numsSize <= 10^4'],
      inputSpec: 'int* nums, int numsSize, int target, int* returnSize',
      outputSpec: 'int* - Array of size 2 containing indices (allocated dynamically).',
      languageId: 'c'
    },
    {
      id: 'c-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a null-terminated string s containing brackets, determine if the input string is valid.',
      constraints: ['s length <= 10^4'],
      inputSpec: 'char* s',
      outputSpec: 'bool - true if valid, false otherwise.',
      languageId: 'c'
    },
    {
      id: 'c-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'Determine the maximum possible stock profit in C.',
      constraints: ['prices array size >= 1'],
      inputSpec: 'int* prices, int pricesSize',
      outputSpec: 'int',
      languageId: 'c'
    },
    {
      id: 'c-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Reverse a singly linked list in C using pointers.',
      constraints: ['Use constant auxiliary space.'],
      inputSpec: 'struct ListNode* head',
      outputSpec: 'struct ListNode*',
      languageId: 'c'
    },
    {
      id: 'c-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists.',
      constraints: ['Modify pointers without allocating new nodes.'],
      inputSpec: 'struct ListNode* list1, struct ListNode* list2',
      outputSpec: 'struct ListNode*',
      languageId: 'c'
    },
    {
      id: 'c-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'Calculate ways to climb n stairs in C.',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'int n',
      outputSpec: 'int',
      languageId: 'c'
    },
    {
      id: 'c-str-rev',
      title: 'Reverse String In-Place',
      difficulty: 'Easy',
      description: 'Write an optimized C function that reverses a null-terminated string in-place using two pointers.',
      constraints: ['Do not allocate extra memory (O(1) auxiliary space)', 'Time Complexity: O(N)'],
      inputSpec: 'char* str - The null-terminated string.',
      outputSpec: 'void - String is mutated in-place.',
      languageId: 'c'
    }
  ],
  r: [
    {
      id: 'r-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given a numeric vector nums and a target integer, return 1-based indices of the two numbers such that they add up to target.',
      constraints: ['2 <= length(nums) <= 10^4'],
      inputSpec: 'nums: numeric vector, target: numeric',
      outputSpec: 'numeric vector - 1-based indices of the two numbers.',
      languageId: 'r'
    },
    {
      id: 'r-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a character string s containing brackets, determine if the input string is valid.',
      constraints: ['s is a character vector of length 1'],
      inputSpec: 's: character string',
      outputSpec: 'logical - TRUE if valid, FALSE otherwise.',
      languageId: 'r'
    },
    {
      id: 'r-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      description: 'Find max profit from prices vector in R.',
      constraints: ['length(prices) >= 1'],
      inputSpec: 'prices: numeric vector',
      outputSpec: 'numeric - Max profit.',
      languageId: 'r'
    },
    {
      id: 'r-reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Reverse a custom linked list structure in R.',
      constraints: ['List representation using nested lists.'],
      inputSpec: 'head: list',
      outputSpec: 'list',
      languageId: 'r'
    },
    {
      id: 'r-merge-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted nested lists.',
      constraints: ['Both inputs are sorted lists.'],
      inputSpec: 'list1: list, list2: list',
      outputSpec: 'list',
      languageId: 'r'
    },
    {
      id: 'r-climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'Compute distinct ways to climb n stairs.',
      constraints: ['1 <= n <= 45'],
      inputSpec: 'n: numeric',
      outputSpec: 'numeric',
      languageId: 'r'
    },
    {
      id: 'r-mean-median',
      title: 'Vector Mean and Median',
      difficulty: 'Easy',
      description: 'Write an R function that takes a numeric vector, removes NA values, and returns a list containing the mean and median.',
      constraints: ['Use na.rm = TRUE in calculations', 'Output must be a named list'],
      inputSpec: 'x: numeric vector',
      outputSpec: 'list - A named list with names "mean" and "median".',
      languageId: 'r'
    },
    {
      id: 'r-dataframe',
      title: 'DataFrame Summary Stats',
      difficulty: 'Medium',
      description: 'Given a data.frame containing logs with columns "category" and "score", remove rows with missing score values, group by category, and return the mean score for each category.',
      constraints: ['Filter out rows where score is NA', 'Group and summarize'],
      inputSpec: 'df: data.frame',
      outputSpec: 'data.frame - A summarized table containing category and mean_score.',
      languageId: 'r'
    }
  ]
};
