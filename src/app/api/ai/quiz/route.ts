import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nodeId, careerGoal, language } = body;

    const goal = (careerGoal || 'full-stack').toLowerCase();
    const lang = (language || 'python').toLowerCase();
    const node = (nodeId || '').toLowerCase();

    let quizzes: any[] = [];
    let flashcards: any[] = [];

    // Tailored questions for Data Analyst
    if (goal === 'data-analyst') {
      if (node.includes('da-1') || node.includes('syntax') || lang === 'r') {
        quizzes = [
          {
            question: lang === 'r' 
              ? 'Which of the following functions is used in R to check if a value is NA?' 
              : 'Which Python function or operator is used to verify if a variable refers to None?',
            options: lang === 'r'
              ? ['is.na()', 'na.check()', 'is.null()', 'na.omit()']
              : ['is None', '== None', 'isNull()', '=== None'],
            answerIndex: 0,
            explanation: lang === 'r'
              ? 'The function is.na() returns a logical vector indicating which elements are missing.'
              : 'In Python, checking "is None" is the idiomatic way to verify None reference equality (checking identity).'
          },
          {
            question: lang === 'r'
              ? 'What dplyr function is used to create new columns in R?'
              : 'Which method is typically used to create or modify columns in a pandas DataFrame?',
            options: lang === 'r'
              ? ['mutate()', 'select()', 'filter()', 'arrange()']
              : ['df.assign() or direct index assignment', 'df.create()', 'df.modify()', 'df.append()'],
            answerIndex: 0,
            explanation: lang === 'r'
              ? 'mutate() is the dplyr verb specifically for creating or transforming columns.'
              : 'Assigning to an index (df["new_col"] = ...) or using df.assign() creates/updates columns in pandas.'
          },
          {
            question: 'What is the primary difference between a structured database table and a CSV file?',
            options: [
              'CSV files enforce strict schema validation and primary keys natively.',
              'Database tables enforce data types, indexes, and primary keys; CSVs are plain text.',
              'CSV files support relational joins natively; database tables do not.',
              'Database tables can only hold numerical data, unlike CSVs.'
            ],
            answerIndex: 1,
            explanation: 'Databases are structured, indexing schemas that enforce constraints, while CSVs are plain text files with no data validation.'
          },
          {
            question: 'Which index query speeds up row retrieval in SQL?',
            options: ['CREATE VIEW', 'CREATE INDEX', 'GROUP BY', 'ORDER BY'],
            answerIndex: 1,
            explanation: 'CREATE INDEX sets up a lookup structure (like a B-Tree) to fetch rows matching lookup keys in O(log N) time.'
          },
          {
            question: 'What does the dplyr function summarise() do when combined with group_by()?',
            options: [
              'Filters rows based on conditions.',
              'Sorts the dataframe in ascending order.',
              'Collapses multiple rows into a single summary row per group.',
              'Saves the dataframe to a local CSV file.'
            ],
            answerIndex: 2,
            explanation: 'In R, group_by() groups vectors, and summarise() collapses each group into summary values like mean, median, or count.'
          }
        ];

        flashcards = [
          {
            front: 'What does the term "NA" represent in R?',
            back: '"Not Available" — R\'s native marker for missing or unknown values.'
          },
          {
            front: 'What is the difference between filter() and select() in dplyr?',
            back: 'filter() subsets rows based on logical conditions, whereas select() subsets columns by name.'
          },
          {
            front: 'How do you clean NA rows from an R data.frame?',
            back: 'Using tidyr::drop_na() or the base R na.omit() function.'
          },
          {
            front: 'What does pandas df.dropna() do in Python?',
            back: 'Removes rows or columns containing NaN (missing) values from the DataFrame.'
          },
          {
            front: 'What is a SQL Primary Key?',
            back: 'A column (or set of columns) that uniquely identifies each row in a database table. It cannot contain NULLs.'
          }
        ];
      } else {
        // Analytics general fallback
        quizzes = [
          {
            question: 'Which SQL JOIN returns all rows from the left table even if there are no matches in the right?',
            options: ['INNER JOIN', 'LEFT JOIN', 'FULL JOIN', 'RIGHT JOIN'],
            answerIndex: 1,
            explanation: 'A LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table and matched rows from the right table, filling with NULL on the right if unmatched.'
          },
          {
            question: 'What statistical measure tells you the spread of data around the mean?',
            options: ['Standard Deviation', 'Median', 'Mode', 'Range'],
            answerIndex: 0,
            explanation: 'Standard Deviation quantifies the amount of variation or dispersion of a set of data values around its mathematical average.'
          },
          {
            question: 'Which plot is best suited for showing correlation between two numerical variables?',
            options: ['Bar Chart', 'Pie Chart', 'Scatter Plot', 'Histogram'],
            answerIndex: 2,
            explanation: 'A Scatter Plot displays coordinates on Cartesian planes, revealing patterns or relationships between two continuous metrics.'
          },
          {
            question: 'What is a primary key constraint?',
            options: ['It guarantees the column is always a string.', 'It guarantees unique, non-null values for row lookup.', 'It automatically increments numbers.', 'It links tables together.'],
            answerIndex: 1,
            explanation: 'Primary keys guarantee uniqueness and exclude null values, enabling accurate row identification.'
          },
          {
            question: 'In databases, what is an aggregate function?',
            options: ['A function that formats dates.', 'A function that performs calculations on multiple values and returns a single value.', 'A trigger that runs code.', 'A procedure that deletes columns.'],
            answerIndex: 1,
            explanation: 'Aggregate functions (like COUNT, SUM, AVG, MIN, MAX) perform calculations on a column collection, summarizing them.'
          }
        ];

        flashcards = [
          {
            front: 'What is the purpose of a GROUP BY clause in SQL?',
            back: 'Groups rows sharing identical values in summary columns, typically for calculating aggregate values like SUM or COUNT.'
          },
          {
            front: 'What is the median of a dataset?',
            back: 'The middle value when the data points are sorted in numerical order. Unlike the mean, it is resistant to outliers.'
          },
          {
            front: 'What does a histogram measure?',
            back: 'The distribution of numerical data by showing the count (frequency) of data points falling in various ranges (bins).'
          },
          {
            front: 'What is a Foreign Key?',
            back: 'A field in one table that references the Primary Key of another table, establishing a relational link between them.'
          },
          {
            front: 'What is the difference between inner and left joins?',
            back: 'Inner join only keeps rows with matches in both tables. Left join keeps all rows from the left table regardless of matches.'
          }
        ];
      }
    } else if (goal === 'agentic-ai') {
      quizzes = [
        {
          question: 'What is the difference between zero-shot prompting and few-shot prompting?',
          options: [
            'Zero-shot provides no examples of the task, while few-shot provides illustrative input-output examples.',
            'Zero-shot calls no model APIs; few-shot runs multiple Parallel calls.',
            'Few-shot requires retraining model weights; zero-shot only shifts context boundaries.',
            'Zero-shot only works on small models; few-shot is for frontier LLMs.'
          ],
          answerIndex: 0,
          explanation: 'Zero-shot asks the model to perform a task directly. Few-shot includes examples in the prompt to align format and logic.'
        },
        {
          question: 'In Vector Databases, what is cosine similarity primarily used for?',
          options: [
            'Encrypting text files.',
            'Measuring the semantic closeness between two query embedding vectors.',
            'Compressing token sizes.',
            'Sorting index items alphabetically.'
          ],
          answerIndex: 1,
          explanation: 'Cosine similarity calculates the cosine of the angle between two multi-dimensional vectors, evaluating semantic correlation.'
        },
        {
          question: 'What is the primary risk of an unconstrained agent tool-calling loop?',
          options: [
            'Model weights shifting automatically.',
            'Infinite recursion, token consumption, and heavy API bills.',
            'The browser tab freezing due to CSS rendering overhead.',
            'Database schemas changing automatically.'
          ],
          answerIndex: 1,
          explanation: 'Without recursion-limit guardrails, an agent might repeatedly call tools in a loop, exhausting tokens and creating excess costs.'
        },
        {
          question: 'What protocol standardizes connecting AI Agents to local tools, resources, and filesystems?',
          options: ['REST OpenAPI', 'Model Context Protocol (MCP)', 'WebSocket Streams', 'gRPC Sync'],
          answerIndex: 1,
          explanation: 'Model Context Protocol (MCP) is an open standard designed to let AI systems interact securely with data files and local tools.'
        },
        {
          question: 'What does RAG stand for in AI systems?',
          options: ['Recursive Agent Graph', 'Retrieval-Augmented Generation', 'Rate-Adjusted Gradient', 'Resource Allocation Gate'],
          answerIndex: 1,
          explanation: 'RAG is Retrieval-Augmented Generation, which searches external documents and feeds them to the LLM context to ground answers.'
        }
      ];

      flashcards = [
        {
          front: 'What is a Vector Embedding?',
          back: 'A list of floating-point numbers representing the semantic meaning of a word, sentence, or document in high-dimensional space.'
        },
        {
          front: 'What does Model Context Protocol (MCP) enable?',
          back: 'Enables safe connection of LLM clients to local data, development tools, and context servers.'
        },
        {
          front: 'What is prompt injection?',
          back: 'A vulnerability where malicious user input overrides system instructions to hijack the model\'s behavior.'
        },
        {
          front: 'What is temperature in LLM generation?',
          back: 'A parameter (0 to 2) that controls randomness. Lower values are deterministic/focused; higher values are creative/diverse.'
        },
        {
          front: 'Why are cost guardrails necessary in Multi-Agent loops?',
          back: 'To terminate execution if agents enter conversational deadlocks or infinite loops, capping billing costs.'
        }
      ];
    } else {
      // Full Stack & General fallbacks
      quizzes = [
        {
          question: 'Which HTTP method is designed to be idempotent and used to retrieve resources?',
          options: ['POST', 'GET', 'DELETE', 'PATCH'],
          answerIndex: 1,
          explanation: 'GET requests are safe and idempotent: repeating the request does not change server state, only retrieves data.'
        },
        {
          question: 'What is the time complexity of looking up a value in a Hash Map / Object Key index on average?',
          options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
          answerIndex: 2,
          explanation: 'Hash maps use a hash index lookup, allowing keys to map to direct values in O(1) constant time on average.'
        },
        {
          question: 'Which React hook is used to perform side effects like data fetching or DOM manipulation?',
          options: ['useState', 'useMemo', 'useEffect', 'useContext'],
          answerIndex: 2,
          explanation: 'useEffect executes code after components render, allowing async side effects like api fetches.'
        },
        {
          question: 'What is connection pooling in backend databases?',
          options: [
            'Deleting inactive users automatically.',
            'Maintaining a cache of open database connections to reuse for incoming requests, improving speed.',
            'Syncing multiple SQL databases together.',
            'Preventing users from modifying tables.'
          ],
          answerIndex: 1,
          explanation: 'Connection pooling keeps a cache of database connections active, avoiding the latency of opening a new socket connection for every request.'
        },
        {
          question: 'What is CORS in web application development?',
          options: [
            'Component Object Rendering System',
            'Cross-Origin Resource Sharing — a browser security mechanism restricting cross-domain API calls.',
            'Cookie Object Retention Standard',
            'Compilation Optimization Rule Structure'
          ],
          answerIndex: 1,
          explanation: 'CORS is Cross-Origin Resource Sharing. It prevents malicious websites from reading data from another origin via the browser.'
        }
      ];

      flashcards = [
        {
          front: 'What is the difference between state and props in React?',
          back: 'State is local data managed within a component; props are external arguments passed down from a parent component.'
        },
        {
          front: 'What is a REST API?',
          back: 'Representational State Transfer — an architectural pattern for exposing resources over HTTP using GET, POST, PUT, DELETE.'
        },
        {
          front: 'What does O(N) time complexity represent?',
          back: 'Linear time complexity — execution time scales in direct proportion to the size of the input data N.'
        },
        {
          front: 'What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?',
          back: 'CSR loads a blank HTML shell and builds UI in the browser; SSR pre-renders HTML on the server for faster initial loads and SEO.'
        },
        {
          front: 'What is a database transaction?',
          back: 'A sequence of database operations treated as a single atomic unit. All operations must succeed (commit) or all fail (rollback).'
        }
      ];
    }

    return NextResponse.json({
      quizzes: quizzes,
      flashcards: flashcards
    });

  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate Quiz request' }, { status: 500 });
  }
}
