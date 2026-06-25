import { NextResponse } from 'next/server';

function isDontKnowMsg(msg: string): boolean {
  if (!msg) return false;
  const m = msg.toLowerCase().trim().replace(/['’]/g, '');
  return (
    m.includes('dont know') ||
    m.includes('dont now') ||
    m.includes('do not know') ||
    m.includes('do not now') ||
    m.includes('no idea') ||
    m.includes('not sure') ||
    m.includes('cant answer') ||
    m.includes('cannot answer') ||
    m.includes('i skip') ||
    m.includes('skip this') ||
    m.includes('explain it') ||
    m.includes('please explain') ||
    m.includes('help me with this')
  );
}

function getQuestionExplanation(questionText: string, langName: string): string {
  const q = questionText.toLowerCase();
  
  if (q.includes('csv') && q.includes('rows')) {
    return `To load a CSV in ${langName} and find the row count:
- Python (Pandas): Use \`df = pd.read_csv("file.csv")\` and \`len(df)\` or \`df.shape[0]\`.
- R (dplyr): Use \`df <- read.csv("file.csv")\` and \`nrow(df)\`.`;
  }
  if (q.includes('sales') && q.includes('filter')) {
    return `To filter rows where sales are less than 0:
- Python: Use boolean indexing like \`df[df['sales'] >= 0]\`.
- R: Use \`filter(df, sales >= 0)\` or subsetting \`df[df$sales >= 0, ]\`.`;
  }
  if (q.includes('list') && q.includes('dictionary') && q.includes('index')) {
    return `A list/vector is ordered and accessed by sequential numeric indexes (e.g., 0, 1, 2). A dictionary/index uses keys (labels) for fast O(1) lookups. Use lists/vectors for sequences, and dictionaries/indices for key-value mappings or labeled tabular rows.`;
  }
  if (q.includes('missing') && q.includes('nan') && q.includes('sales')) {
    return `To handle missing (NaN/NA) values:
- Python: Use \`df.dropna()\` to drop or \`df.fillna(value)\` to impute.
- R: Use \`na.omit(df)\` or \`tidyr::replace_na()\` or \`mean(x, na.rm = TRUE)\`.`;
  }
  if (q.includes('group') && q.includes('category') && q.includes('average')) {
    return `To group by Category and calculate average sales:
- Python: \`df.groupby('Category')['sales'].mean()\`.
- R: \`df %>% group_by(Category) %>% summarise(avg_sales = mean(sales, na.rm = TRUE))\`.`;
  }
  if (q.includes('detect') && q.includes('duplicate')) {
    return `To remove duplicate rows:
- Python: \`df.drop_duplicates(keep='first')\` (or \`keep='last'\`).
- R: \`df %>% distinct()\` or \`duplicated()\` functions.`;
  }
  if (q.includes('large 5gb') || q.includes('5gb sales')) {
    return `To process a large 5GB dataset on limited memory (2GB):
- Python: Load file in chunks using \`pd.read_csv('file.csv', chunksize=100000)\` or use libraries like \`Dask\`, \`Polars\`, or databases.
- R: Use the \`data.table\` library or \`vroom\` which map files to memory efficiently.`;
  }
  if (q.includes('join') && q.includes('million') && q.includes('customers')) {
    return `To optimize merging a 1 million row table with a 1,000 row table:
- Ensure the smaller table is joined onto the larger one, or broadcast-join if using distributed systems.
- Index/key the merge column beforehand to avoid full scans.`;
  }
  if (q.includes('chart') && q.includes('drop') && q.includes('mismatch')) {
    return `To trace a mismatch between database API traffic and visual dashboard metrics:
1. Verify timezone offsets or data aggregation gaps.
2. Check frontend caching or page-level API filters.
3. Compare database counts directly with the exact query driving the chart.`;
  }

  if (q.includes('hello world') || q.includes('simple') && q.includes('http server')) {
    return `To write a basic HTTP server/API in ${langName}:
- JavaScript/TypeScript: Use Express \`app.get('/api', (req, res) => res.json({ message: 'Hello' }))\`.
- Python: Use FastAPI \`@app.get("/") def read_root(): return {"Hello": "World"}\`.`;
  }
  if (q.includes('click') && q.includes('counter')) {
    return `To handle a click event to update a counter:
- React: Use state hook \`const [count, setCount] = useState(0)\` and call \`setCount(count + 1)\` on an \`onClick\` handler.
- Vanilla JS: Add event listener \`btn.addEventListener('click', () => count++)\` and update DOM text.`;
  }
  if (q.includes('store') && q.includes('list of users') && q.includes('memory')) {
    return `To store a list of users in memory, use an Array/List structure (e.g. \`let users = []\` or \`List<User>\`). To add a user, use push/add methods: \`users.push(newUser)\`.`;
  }
  if (q.includes('validate') && q.includes('email') && q.includes('database')) {
    return `To validate input prior to saving:
- Check values against regular expressions or schema validation libraries (like Zod, Joi).
- Ensure required fields exist, parse email strings, and escape database injection vectors.`;
  }
  if (q.includes('api call') && q.includes('loading state')) {
    return `To handle 2-3s api load times:
- Use a loading boolean state variable (e.g. \`isLoading\`).
- Render a spinner, skeleton placeholder, or loading text when true, switching it to false once the API promise resolves.`;
  }
  if (q.includes('get request') && q.includes('post request')) {
    return `GET requests retrieve data and parameters are visible in the URL (idempotent/cached). POST requests send data to be processed in the request body (non-idempotent, used for creation/update).`;
  }
  if (q.includes('connection dropouts') || q.includes('timeouts')) {
    return `To handle database connection dropouts gracefully:
- Implement a connection pool with automatic retries and backoff limits.
- Return explicit HTTP 503 Service Unavailable errors instead of letting requests hang and time out.`;
  }
  if (q.includes('render') && q.includes('800ms') && q.includes('long list')) {
    return `To optimize a long list rendering:
- Use list virtualization/windowing (e.g., react-window, react-virtualized) to only render visible items.
- Memoize list items with React.memo or useMemo to prevent unnecessary re-renders.`;
  }
  if (q.includes('secrets') && q.includes('api keys') && q.includes('environments')) {
    return `To manage secrets securely:
- Never hardcode keys; use environment variables (\`process.env\` or \`.env\` files).
- In production, use secret managers (like GCP Secret Manager, AWS Secrets Manager) and configure separate local/staging/prod keys.`;
  }

  if (q.includes('llm api') || (q.includes('gemini') && q.includes('openai'))) {
    return `To make a basic LLM API call in ${langName}:
- Import the SDK, configure the client with an API key, and call the generate method: e.g. \`client.models.generateContent({ model: 'gemini-2.5-flash', contents: '...' })\`.`;
  }
  if (q.includes('loop') && q.includes('queries') && q.includes('ai model')) {
    return `To send multiple queries, loop through them using \`for query in queries:\` (Python) or \`for (const query of queries)\` (JS) and wait for the async API call within the loop or execute them concurrently with promise groupings.`;
  }
  if (q.includes('rate limit') || q.includes('try-catch')) {
    return `Use try-catch/except blocks:
\`\`\`${langName === 'Python' ? 'python' : 'javascript'}
try {
  // call API
} catch (error) {
  console.log("We ran into a rate limit. Please try again in a moment.");
}
\`\`\``;
  }
  if (q.includes('prompt template')) {
    return `A prompt template uses placeholders to dynamically inject values:
- Python: \`f"Hello {name}, your role is {role}."\`
- JS/TS: \`\`Hello \${name}, your role is \${role}.\`\``;
  }
  if (q.includes('conversational history')) {
    return `To represent conversational history, use an array of objects matching role and content:
\`const history = [{ role: 'user', text: '...' }, { role: 'model', text: '...' }]\`
Append new messages as they occur to retain context.`;
  }
  if (q.includes('guardrail') && q.includes('forbidden')) {
    return `To implement guardrails:
- Filter the LLM output string using a list of forbidden keywords or regular expressions.
- If a match is found, replace the output with a generic safe response or trigger a warning.`;
  }
  if (q.includes('infinite') || q.includes('recursion') || q.includes('recursion or rate-limiting')) {
    return `To prevent agent infinite loops:
- Limit the maximum number of iterations/steps in the execution loop (e.g. \`max_steps = 10\`).
- Track repeated tool calls and halt if the same input/tool sequence occurs consecutively.`;
  }
  if (q.includes('rag') || q.includes('irrelevant chunks')) {
    return `To improve RAG retrieval:
- Use hybrid search (vector similarity + keyword search).
- Apply a re-ranking model (like Cohere ReRank) on retrieved chunks.
- Refine chunk size/overlap and add metadata tags (e.g. date, category) for pre-filtering.`;
  }
  if (q.includes('cost-guardrails') || q.includes('injection defense')) {
    return `For production AI security:
- Implement token budgets per request and daily caps.
- Use system prompts that explicitly instruct the model to ignore user override commands.
- Run input sanitization and verification on the model's output before using it in tools.`;
  }

  if (q.includes('sum')) {
    return `To return the sum of two inputs:
- Python: \`def sum(a, b): return a + b\`
- JavaScript: \`function sum(a, b) { return a + b; }\``;
  }
  if (q.includes('even numbers')) {
    return `To print even numbers from a list:
- Loop through the list, check if \`num % 2 == 0\` using the modulo operator, and print if true.`;
  }
  if (q.includes('verify') && q.includes('number') && q.includes('crashing')) {
    return `To verify inputs:
- JavaScript: Use \`typeof x === 'number'\` or \`isNaN(x)\`.
- Python: Use \`isinstance(x, (int, float))\`.`;
  }
  if (q.includes('search') && q.includes('time complexity')) {
    return `Searching a list/array has O(N) linear time complexity because you may need to scan every item. Searching a Set or Dictionary (hash map) has O(1) constant time complexity because it uses a hash table lookup.`;
  }
  if (q.includes('text file') && q.includes('count')) {
    return `To count a target word in a file, open the file, read line by line or the entire text, split it by spaces or use regex to find all matches, and sum the occurrences.`;
  }
  if (q.includes('value') && q.includes('reference')) {
    return `Pass-by-value copies the variable's value into a new memory location (changes inside function do not affect original). Pass-by-reference passes the memory address (changes inside function modify the original object).`;
  }
  if (q.includes('design patterns') || q.includes('modular')) {
    return `Use patterns like Singleton, Factory, or Dependency Injection to write modular code. Separate your logic into clean layers: controllers, services, and repositories.`;
  }
  if (q.includes('linear') && (q.includes('o(n^2)') || q.includes('n^2'))) {
    return `To optimize O(N^2) checks to O(N), use a Set or Hash Map to store elements you have already visited. This replaces a nested search loop with O(1) lookups.`;
  }
  if (q.includes('logging') && q.includes('production')) {
    return `Use structured logging libraries (e.g., Winston, Pino, or Python logging) that write logs in JSON format. Capture stack traces for errors and set appropriate log levels (debug, info, warn, error).`;
  }

  return `In ${langName}, we can write clean code by handling empty inputs, using appropriate data structures (like arrays or key-value stores), and running loops safely.`;
}async function runBackgroundEvaluator(
  sessionId: string,
  candidateMsg: string,
  activeTopic: string,
  apiKey: string,
  isOpenRouter: boolean
) {
  try {
    const { supabase } = await import('@/database/supabaseClient');
    if (!supabase) return;

    // 1. Retrieve the previous interviewer question from dialogue history.
    const { data: history, error: historyErr } = await supabase
      .from('logic2code_interview_dialogue_history')
      .select('message, role')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (historyErr || !history) {
      console.error('[Evaluator] Error fetching history:', historyErr);
      return;
    }

    // Find the last interviewer message before the candidate's last message.
    let candidateIndex = -1;
    for (let i = 0; i < history.length; i++) {
      if (history[i].role === 'candidate') {
        candidateIndex = i;
        break;
      }
    }

    let prevQuestion = 'Introduction';
    if (candidateIndex !== -1) {
      for (let i = candidateIndex + 1; i < history.length; i++) {
        if (history[i].role === 'interviewer') {
          prevQuestion = history[i].message;
          break;
        }
      }
    }

    console.log(`[Evaluator] Evaluating answer. PrevQuestion: "${prevQuestion.slice(0, 50)}...", Answer: "${candidateMsg.slice(0, 50)}..."`);

    // 2. Invoke Gemini/OpenRouter to evaluate
    const evalPrompt = `You are [Sarah Johnson], an expert AI Technical Interview Evaluator.
Evaluate the candidate's response to the following technical question.

Question: "${prevQuestion}"
Candidate's Response: "${candidateMsg}"
Active Topic/Skill: "${activeTopic}"

Provide a detailed evaluation in JSON format with the following exact keys:
{
  "score": <score from 0 to 100, integer>,
  "confidence": <confidence score from 0.0 to 1.0, float>,
  "rubric": "<detailed breakdown of why this score was given, and how it maps to criteria>",
  "missing_concepts": ["<concept 1>", "<concept 2>"]
}
Output ONLY the raw JSON. Do not wrap in markdown or code blocks.`;

    let score = 75;
    let confidence = 0.8;
    let rubric = 'Good attempt. Explained the basics.';
    let missingConcepts: string[] = [];

    if (isOpenRouter) {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Logic2Code AI'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{ role: 'user', content: evalPrompt }],
            response_format: { type: 'json_object' }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim() || '';
        try {
          const parsed = JSON.parse(content.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim());
          score = typeof parsed.score === 'number' ? parsed.score : score;
          confidence = typeof parsed.confidence === 'number' ? parsed.confidence : confidence;
          rubric = parsed.rubric || rubric;
          missingConcepts = Array.isArray(parsed.missing_concepts) ? parsed.missing_concepts : missingConcepts;
        } catch (e) {
          console.warn('[Evaluator] JSON parse error:', e, content);
        }
      }
    } else {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: evalPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        try {
          const parsed = JSON.parse(content.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim());
          score = typeof parsed.score === 'number' ? parsed.score : score;
          confidence = typeof parsed.confidence === 'number' ? parsed.confidence : confidence;
          rubric = parsed.rubric || rubric;
          missingConcepts = Array.isArray(parsed.missing_concepts) ? parsed.missing_concepts : missingConcepts;
        } catch (e) {
          console.warn('[Evaluator] JSON parse error:', e, content);
        }
      }
    }

    // 3. Save findings to the candidate skill matrix
    const { error: upsertErr } = await supabase
      .from('logic2code_candidate_skill_matrix')
      .upsert({
        session_id: sessionId,
        skill_name: activeTopic,
        score: score,
        confidence_score: confidence,
        last_evaluated_at: new Date().toISOString()
      }, { onConflict: 'session_id,skill_name' });

    if (upsertErr) {
      console.error('[Evaluator] Error upserting skill matrix:', upsertErr);
    }

    // 4. Update the candidate's last message with the score and rubric
    const { data: latestCandidateMsg } = await supabase
      .from('logic2code_interview_dialogue_history')
      .select('id')
      .eq('session_id', sessionId)
      .eq('role', 'candidate')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestCandidateMsg) {
      await supabase
        .from('logic2code_interview_dialogue_history')
        .update({
          associated_rubric: rubric,
          evaluation_score: score
        })
        .eq('id', latestCandidateMsg.id);
    }

    console.log(`[Evaluator] Successfully graded turn. Score: ${score}, Skill: ${activeTopic}`);
  } catch (err) {
    console.error('[Evaluator] Background execution encountered an error:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { career_goal, selected_language, message, history, experience_level, resumeText } = body;

    const goal = (career_goal || 'full-stack').toLowerCase();
    const lang = (selected_language || 'python').toLowerCase();
    const level = (experience_level || 'beginner').toLowerCase();
    const langName = lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang === 'typescript' ? 'TypeScript' : lang.charAt(0).toUpperCase() + lang.slice(1);

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const isOpenRouter = !!(process.env.OPENROUTER_API_KEY || (apiKey && apiKey.startsWith('sk-or-')));

    // Get Auth Candidate ID dynamically
    const { getUserIdFromRequest } = await import('@/lib/auth');
    const { supabase } = await import('@/database/supabaseClient');
    const { retrieveChunks, formatRAGContext } = await import('@/lib/rag/knowledgeBase');

    const candidateId = await getUserIdFromRequest(request);
    const isDbAvailable = !!(supabase && candidateId);

    let session = null;
    let candidateAnswersCount = 0;
    let activeTopic = 'syntax';
    let currentDifficulty = level === 'beginner' ? 'beginner' : level === 'advanced' ? 'advanced' : 'intermediate';
    let askedQuestionIds: string[] = [];

    if (isDbAvailable) {
      try {
        // Find existing session
        const sessionId = body.sessionId || body.session_id;
        if (sessionId) {
          const { data, error } = await supabase
            .from('logic2code_interview_session')
            .select('*')
            .eq('id', sessionId)
            .eq('candidate_id', candidateId)
            .maybeSingle();
          if (data) session = data;
        }

        if (!session) {
          // If no sessionId was provided, look for the most recent active session within 2 hours
          const { data: activeSessions } = await supabase
            .from('logic2code_interview_session')
            .select('*')
            .eq('candidate_id', candidateId)
            .order('updated_at', { ascending: false })
            .limit(1);
          if (activeSessions && activeSessions.length > 0) {
            const latest = activeSessions[0];
            if (Date.now() - new Date(latest.updated_at).getTime() < 2 * 60 * 60 * 1000) {
              session = latest;
            }
          }
        }

        // Initialize new session if not found (or starting fresh)
        if (!session) {
          let topics = ['syntax', 'oop', 'database', 'concurrency', 'memory'];
          if (goal === 'data-analyst') {
            topics = ['syntax', 'database', 'memory', 'statistics'];
          } else if (goal === 'agentic-ai') {
            topics = ['syntax', 'memory', 'concurrency', 'security'];
          }

          const newSession = {
            candidate_id: candidateId,
            target_role: goal,
            current_difficulty: currentDifficulty,
            active_topic: topics[0],
            topic_queue: topics,
            asked_question_ids: []
          };

          const { data: inserted, error: insertErr } = await supabase
            .from('logic2code_interview_session')
            .insert(newSession)
            .select()
            .single();

          if (inserted) {
            session = inserted;
          } else {
            console.error('Error inserting session, falling back to local simulation:', insertErr);
          }
        }

        if (session) {
          // Check how many candidate turns have completed
          const { count } = await supabase
            .from('logic2code_interview_dialogue_history')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id)
            .eq('role', 'candidate');
          
          candidateAnswersCount = count || 0;
          askedQuestionIds = session.asked_question_ids || [];

          // Transition topic based on turn count index
          const topicIndex = Math.min(candidateAnswersCount, session.topic_queue.length - 1);
          activeTopic = session.topic_queue[topicIndex] || 'syntax';

          if (session.active_topic !== activeTopic) {
            await supabase
              .from('logic2code_interview_session')
              .update({ active_topic: activeTopic, updated_at: new Date().toISOString() })
              .eq('id', session.id);
            session.active_topic = activeTopic;
          }

          // Dynamic difficulty adaptation based on average of skill matrix scores
          const { data: skills } = await supabase
            .from('logic2code_candidate_skill_matrix')
            .select('score')
            .eq('session_id', session.id);

          if (skills && skills.length > 0) {
            const avgScore = skills.reduce((sum, s) => sum + s.score, 0) / skills.length;
            let newDiff = session.current_difficulty;
            if (avgScore > 80) {
              newDiff = 'advanced';
            } else if (avgScore < 50) {
              newDiff = 'beginner';
            } else {
              newDiff = 'intermediate';
            }
            if (newDiff !== session.current_difficulty) {
              await supabase
                .from('logic2code_interview_session')
                .update({ current_difficulty: newDiff, updated_at: new Date().toISOString() })
                .eq('id', session.id);
              session.current_difficulty = newDiff;
            }
          }
          currentDifficulty = session.current_difficulty;
        }
      } catch (dbErr) {
        console.error('Database query failed. Falling back to local simulation logic:', dbErr);
        session = null;
      }
    }

    // Fallback: If session is null or DB is unavailable, compute values using history length
    if (!session) {
      candidateAnswersCount = history ? history.filter((h: any) => h.role === 'candidate').length : 0;
      let topics = ['syntax', 'oop', 'database', 'concurrency', 'memory'];
      if (goal === 'data-analyst') {
        topics = ['syntax', 'database', 'memory', 'statistics'];
      } else if (goal === 'agentic-ai') {
        topics = ['syntax', 'memory', 'concurrency', 'security'];
      }
      const topicIndex = Math.min(candidateAnswersCount, topics.length - 1);
      activeTopic = topics[topicIndex] || 'syntax';
      currentDifficulty = level === 'beginner' ? 'beginner' : level === 'advanced' ? 'advanced' : 'intermediate';
    }

    // Save Candidate's response into database
    if (isDbAvailable && session && message) {
      await supabase.from('logic2code_interview_dialogue_history').insert({
        session_id: session.id,
        role: 'candidate',
        message: message
      });
    }

    // Get full dialogue history for prompting
    let dialogueMessages: { role: string; message: string }[] = [];
    if (isDbAvailable && session) {
      const { data: dbHistory } = await supabase
        .from('logic2code_interview_dialogue_history')
        .select('role, message')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      if (dbHistory) {
        dialogueMessages = dbHistory.map(h => ({
          role: h.role,
          message: h.message
        }));
      }
    }

    if (dialogueMessages.length === 0) {
      dialogueMessages = (history || []).map((h: any) => ({
        role: h.role === 'interviewer' ? 'interviewer' : 'candidate',
        message: h.text
      }));
      if (message) {
        dialogueMessages.push({ role: 'candidate', message: message });
      }
    }

    // Determine if it is the evaluation turn
    let isEvaluationTurn = false;
    if (isDbAvailable && session) {
      const codingMsgIndex = dialogueMessages.findIndex(m => m.role === 'candidate' && m.message.includes('completed the coding assignment'));
      if (codingMsgIndex !== -1) {
        const candidateMsgsAfterCoding = dialogueMessages.slice(codingMsgIndex + 1).filter(m => m.role === 'candidate').length;
        if (candidateMsgsAfterCoding >= 1) {
          isEvaluationTurn = true;
        }
      }
    } else {
      isEvaluationTurn = candidateAnswersCount >= 5;
    }

    // Retrieve skill matrix scores for final evaluation prompt injection
    let skillMatrixSummary = '';
    if (isDbAvailable && session && isEvaluationTurn) {
      const { data: skills } = await supabase
        .from('logic2code_candidate_skill_matrix')
        .select('skill_name, score, confidence_score')
        .eq('session_id', session.id);
      if (skills && skills.length > 0) {
        skillMatrixSummary = `\n# EVALUATED TOPICS & SKILL SCORES:\n` + 
          skills.map(s => `- ${s.skill_name}: Score ${s.score}/100 (Confidence: ${Math.round(s.confidence_score * 100)}%)`).join('\n') + '\n';
      }
    }

    // --- GET GROUNDING RAG CONTEXT ---
    let ragContext = '';
    let usedChunkIds: string[] = [];
    if (!isEvaluationTurn) {
      try {
        let retrieved = await retrieveChunks(message || career_goal || '', lang, 3, {
          difficulty: currentDifficulty,
          topic: activeTopic
        });

        let freshChunks = retrieved.filter(c => !askedQuestionIds.includes(c.id));
        if (freshChunks.length === 0 && retrieved.length > 0) {
          freshChunks = retrieved;
        }

        if (freshChunks.length > 0) {
          ragContext = formatRAGContext(freshChunks);
          usedChunkIds = freshChunks.map(c => c.id);

          if (isDbAvailable && session) {
            const updatedAskedIds = Array.from(new Set([...askedQuestionIds, ...usedChunkIds]));
            await supabase
              .from('logic2code_interview_session')
              .update({ asked_question_ids: updatedAskedIds, updated_at: new Date().toISOString() })
              .eq('id', session.id);
          }
        }
      } catch (ragErr) {
        console.error('Failed to retrieve or filter RAG chunks:', ragErr);
      }
    }

    // Map current round description
    let roundName = 'Introduction';
    if (isDbAvailable && session) {
      if (candidateAnswersCount < 6) {
        roundName = 'Introduction & Onboarding';
      } else if (candidateAnswersCount === 6) {
        roundName = 'Assessment & Level Verification';
      } else if (candidateAnswersCount === 7) {
        roundName = 'Technical Question 1';
      } else if (candidateAnswersCount === 8) {
        roundName = 'Technical Question 2';
      } else if (candidateAnswersCount === 9) {
        roundName = 'Coding Challenge Review';
      } else if (candidateAnswersCount === 10) {
        roundName = 'Behavioral Round';
      } else {
        roundName = 'Final Evaluation';
      }
    } else {
      roundName = candidateAnswersCount === 0 ? 'Introduction Analysis' : candidateAnswersCount === 1 ? 'Project Deep Dive' : candidateAnswersCount === 2 ? 'Technology Discussion' : candidateAnswersCount === 3 ? 'Technical Questions' : candidateAnswersCount === 4 ? 'Behavioral Questions' : 'Final Evaluation';
    }

    // --- LIVE MODE ---
    if (apiKey) {
      const systemPrompt = `You are [Sarah Johnson], a [Senior Engineering Manager] with 12+ years of experience conducting a realistic technical software engineering interview.

# PRIMARY OBJECTIVE
Conduct a natural, human-like interview. You are NOT a chatbot, exam engine, or rapid-fire question generator. You are a professional engineering manager having a real conversation.

${resumeText ? `# CANDIDATE RESUME
${resumeText}

# RESUME INSTRUCTIONS
- You MUST customize the interview questions dynamically using the Candidate Resume.
- Ask questions specifically based on the candidate's experience, listed skills, and projects.
- Avoid generic interview questions (e.g. do not ask "What is React?"). Instead, ask personalized questions like: "Tell me about the React project mentioned in your resume."
- Create personalized follow-up questions based on their resume content.
` : ''}

${ragContext ? `# TECHNICAL CONTEXT (RAG GROUNDING)
${ragContext}
- Use the technical concept(s) from the context to form a highly specific question.
- Do NOT repeat questions or ask generic definitions. Formulate your question around the specific scenarios or coding patterns shown in the retrieved context.
` : ''}

# SPEAKING RULES
IMPORTANT: Speak slowly and clearly. Do not rush through sentences. Do not merge multiple sentences together. Pause naturally after:
* Greetings
* Introductions
* Questions
* Important statements

# RESPONSE LENGTH
Maximum: 3-4 sentences. Never generate large paragraphs. Keep responses conversational and slow-paced.

# VISUAL HIGHLIGHTING & KEYWORD TAGGING
You MUST wrap the following entities in square brackets so they can stand out visually as chips in the UI:
- Candidate Name (e.g. [Candidate Name] or their actual name if provided)
- Recruiter Name (always wrap as [Sarah Johnson])
- Role Titles (e.g. [Full Stack Developer], [Frontend Developer], [Backend Developer], [Software Engineer], [Senior Software Engineering Manager], [Senior Engineering Manager])
- Technologies (e.g. [JavaScript], [TypeScript], [React], [Node.js], [Express], [MongoDB], [PostgreSQL], [Next.js], etc.)
- Projects (e.g. [ATS Resume Analyzer], [E-Commerce Platform], [Chat Application])
- Experience Levels (e.g. [Student], [Fresher], [Junior], [Mid-Level], [Senior])
- Interview Skills (e.g. [Communication], [Problem Solving], [System Design], [Coding], [Debugging], [Architecture], [Testing])

# CANDIDATE CONTEXT
- Target Role: "${goal}" career track (Target Role: ${career_goal || 'full-stack'})
- Programming Language: "${langName}"
- Candidate Experience Level: "${level}"
- Current Interview Round: ${roundName}
- Number of candidate responses so far: ${candidateAnswersCount}
- Is this the final evaluation turn? ${isEvaluationTurn ? 'YES' : 'NO'}
${skillMatrixSummary}

# CRITICAL MEMORY RULES
1. Review the Conversation History before responding.
2. Never ask for information that already exists. If the candidate has introduced themselves, DO NOT ask: "Tell me about yourself", "What technologies do you know?", "What projects have you built?", or "What is your background?".
3. Generate a follow-up question based on their previous answers, prioritizing their projects, technologies, and career goals.

# INTRODUCTION ANALYSIS
When the candidate introduces themselves, extract and remember their details. Summarize your understanding (e.g. "Thank you, [Name]. I understand that you're...") and move directly into a follow-up question. Never ask for their introduction again.

# ACTIVE LISTENING & SPEAKING STYLE
After every candidate answer:
1. Acknowledge the answer and give a brief observation (e.g. "That's a good approach", "Interesting solution").
2. Ask exactly ONE follow-up question. Never ask multiple questions together.
3. Maximum response length: 3-4 sentences. Do not generate long paragraphs. Keep it highly conversational, warm, professional, encouraging, and human-like.

# OUTPUT FORMAT
${isEvaluationTurn ? `
The interview is now complete. Evaluate the candidate's performance across the entire conversation history.
You MUST respond with a single, valid JSON object matching the following structure:
{
  "isFinished": true,
  "score": <overall grade out of 100, number>,
  "metrics": {
    "codingLogic": <score 0-100, number>,
    "communication": <score 0-100, number>,
    "systemDesign": <score 0-100, number>,
    "problemSolving": <score 0-100, number>
  },
  "feedback": "<detailed overview of candidate performance, constructive critique>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>"]
}
DO NOT output any markdown tags (like \`\`\`json) or extra text. Output ONLY the raw JSON.` : `
Ask the next question using the structured format: Acknowledge -> Observe -> One Follow-up.
If the candidate indicated they do not know the answer or requested help/explanation, you MUST first explain the correct answer with a small code example, and then ask the next question.
Output ONLY plain text. Do not output JSON. Do not include markdown code fences around the entire response. Keep responses under 4 sentences.`}
`;

      if (isOpenRouter) {
        // --- OPENROUTER API CALL ---
        const chatMessages = [
          { role: 'system', content: systemPrompt },
          ...dialogueMessages.map((m) => ({
            role: m.role === 'interviewer' ? 'assistant' : 'user',
            content: m.message
          }))
        ];

        try {
          const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Logic2Code AI'
              },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: chatMessages,
                response_format: isEvaluationTurn ? { type: 'json_object' } : undefined
              })
            }
          );

          if (response.ok) {
            const data = await response.json();
            let responseText = data.choices?.[0]?.message?.content?.trim() || '';

            if (isEvaluationTurn) {
              let jsonText = responseText;
              if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim();
              }
              try {
                const scorecard = JSON.parse(jsonText);
                
                // Save final scorecard to DB
                if (isDbAvailable && session) {
                  await supabase.from('logic2code_interview_dialogue_history').insert({
                    session_id: session.id,
                    role: 'interviewer',
                    message: JSON.stringify(scorecard)
                  });
                }

                return NextResponse.json({
                  isFinished: true,
                  score: scorecard.score || 80,
                  metrics: scorecard.metrics || { codingLogic: 80, communication: 80, systemDesign: 80, problemSolving: 80 },
                  feedback: scorecard.feedback || 'Great job completing the interview.',
                  strengths: scorecard.strengths || ['Good communication', 'Correct scoping'],
                  suggestions: scorecard.suggestions || ['Review big-O complexity patterns'],
                  mode: 'live-openrouter'
                });
              } catch (jsonErr) {
                console.warn('Failed to parse OpenRouter scorecard JSON:', jsonErr, responseText);
              }
            } else {
              if (responseText.startsWith('```') && responseText.endsWith('```')) {
                responseText = responseText.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim();
              }

              // Save Interviewer Question to DB
              if (isDbAvailable && session) {
                await supabase.from('logic2code_interview_dialogue_history').insert({
                  session_id: session.id,
                  role: 'interviewer',
                  message: responseText
                });

                // Decoupled Background Evaluator execution
                if (message) {
                  runBackgroundEvaluator(session.id, message, activeTopic, apiKey, isOpenRouter);
                }
              }

              return NextResponse.json({
                isFinished: false,
                question: responseText || 'What optimization checks would you write to secure this routing loop?',
                mode: 'live-openrouter'
              });
            }
          }
        } catch (openRouterErr) {
          console.error('Error invoking OpenRouter API:', openRouterErr);
        }
      }

      // --- DIRECT GEMINI API CALL (FALLBACK) ---
      const formattedHistory = dialogueMessages.map((m) => {
        return `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.message}`;
      }).join('\n');

      const promptPayload = `System Instructions:\n${systemPrompt}\n\nDialogue History:\n${formattedHistory}\n\nResponse:`;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: promptPayload }
                  ]
                }
              ],
              generationConfig: isEvaluationTurn ? {
                responseMimeType: "application/json"
              } : undefined
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

          if (isEvaluationTurn) {
            let jsonText = responseText;
            if (jsonText.startsWith('```')) {
              jsonText = jsonText.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim();
            }
            try {
              const scorecard = JSON.parse(jsonText);

              // Save final scorecard to DB
              if (isDbAvailable && session) {
                await supabase.from('logic2code_interview_dialogue_history').insert({
                  session_id: session.id,
                  role: 'interviewer',
                  message: JSON.stringify(scorecard)
                });
              }

              return NextResponse.json({
                isFinished: true,
                score: scorecard.score || 80,
                metrics: scorecard.metrics || { codingLogic: 80, communication: 80, systemDesign: 80, problemSolving: 80 },
                feedback: scorecard.feedback || 'Great job completing the interview.',
                strengths: scorecard.strengths || ['Good communication', 'Correct scoping'],
                suggestions: scorecard.suggestions || ['Review big-O complexity patterns'],
                mode: 'live'
              });
            } catch (jsonErr) {
              console.warn('Failed to parse Gemini scorecard JSON, falling back:', jsonErr, responseText);
            }
          } else {
            if (responseText.startsWith('```') && responseText.endsWith('```')) {
              responseText = responseText.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim();
            }

            // Save Interviewer Question to DB
            if (isDbAvailable && session) {
              await supabase.from('logic2code_interview_dialogue_history').insert({
                session_id: session.id,
                role: 'interviewer',
                message: responseText
              });

              // Decoupled Background Evaluator execution
              if (message) {
                runBackgroundEvaluator(session.id, message, activeTopic, apiKey, isOpenRouter);
              }
            }

            return NextResponse.json({
              isFinished: false,
              question: responseText || 'What optimization checks would you write to secure this routing loop?',
              mode: 'live'
            });
          }
        }
      } catch (geminiErr) {
        console.error('Error invoking Gemini live endpoint, falling back to mock:', geminiErr);
      }
    }

    // --- FALLBACK MOCK MODE (Used if API Key is missing or request fails) ---
    const questionsByLevel: Record<string, Record<string, string[]>> = {
      'beginner': {
        'data-analyst': [
          `In ${langName}, how do you load a CSV file using standard packages or Pandas/dplyr and find the total number of rows? (Simulation Mode)`,
          `If you have a table of sales data and you want to filter out rows where sales are less than 0, how would you write that filter condition in your code? (Simulation Mode)`,
          `What is the difference between a list and a dictionary/dataframe index in ${langName}, and when would you use one over the other for data manipulation? (Simulation Mode)`
        ],
        'full-stack': [
          `How do you write a simple 'Hello World' HTTP server or basic API endpoint in ${langName} that returns a JSON message? (Simulation Mode)`,
          `In frontend code, how do you handle a click event on a button to update a counter variable on the page? (Simulation Mode)`,
          `If you want to store a list of users in memory in ${langName}, what data structure would you use, and how do you add a new user to it? (Simulation Mode)`
        ],
        'agentic-ai': [
          `In ${langName}, how do you make a basic HTTP call to an LLM API (like Gemini or OpenAI) using a system parameter and a user prompt? (Simulation Mode)`,
          `How would you write a simple loop in ${langName} that reads a list of user queries and sends each one to an AI model? (Simulation Mode)`,
          `If the API returns an error (e.g. rate limit reached), how do you use a try-catch/except block in ${langName} to print a friendly message? (Simulation Mode)`
        ],
        'default': [
          `How do you write a simple function in ${langName} that takes two numbers as inputs and returns their sum? (Simulation Mode)`,
          `If you have a list of numbers, how do you write a loop in ${langName} to print only the even numbers? (Simulation Mode)`,
          `How do you handle errors or verify that an input is a number in your ${langName} function to prevent it from crashing? (Simulation Mode)`
        ]
      },
      'intermediate': {
        'data-analyst': [
          `How would you handle missing (null/NaN) values in a sales dataset in ${langName}? What functions do you use to fill or drop them? (Simulation Mode)`,
          `If you need to group a table of transactions by 'Category' and calculate the average sales price, how would you structure this aggregation in ${langName}? (Simulation Mode)`,
          `How do you detect and remove duplicate rows in a dataset using ${langName}? What options do you have to keep the first vs. last duplicate? (Simulation Mode)`
        ],
        'full-stack': [
          `How do you validate user input on the backend (e.g. checking that an email parameter is valid) before saving it to a database? (Simulation Mode)`,
          `If an API call takes 2-3 seconds to load data from a database, how would you handle the loading state in the user interface to keep the user informed? (Simulation Mode)`,
          `What is the difference between a GET request and a POST request in your web API, and when should you use each? (Simulation Mode)`
        ],
        'agentic-ai': [
          `How do you define a prompt template in ${langName} to inject variable data (like a user's name or active career goal) before sending it to an AI model? (Simulation Mode)`,
          `If you want to save a simple conversational history (a list of user and assistant messages) so the model remembers context, how would you represent this list in your code? (Simulation Mode)`,
          `How would you write a basic guardrail function in ${langName} to check if an LLM output contains any forbidden words before showing it to the user? (Simulation Mode)`
        ],
        'default': [
          `How would you search for a specific value in an array/list in ${langName}? What is the difference in time complexity between searching a list vs. a set/dictionary? (Simulation Mode)`,
          `How do you read a text file line-by-line in ${langName} and count how many times a target word appears? (Simulation Mode)`,
          `What is the difference between passing an argument by value vs. by reference in ${langName}? How does this affect variables passed to functions? (Simulation Mode)`
        ]
      },
      'advanced': {
        'data-analyst': [
          `How would you approach reading a large 5GB sales dataset in ${langName} if you only have 2GB of system memory? What libraries or techniques would you use to aggregate monthly totals? (Simulation Mode)`,
          `Excellent. Next, suppose you join two tables: 'Orders' (with 1 million rows) and 'Customers' (with 1,000 rows). How would you optimize the merge operation in your code to prevent memory spikes? (Simulation Mode)`,
          `Perfect. Final question: If your line chart visualization displays an unexpected 50% drop in active users, but the database logs show normal API traffic, what data auditing steps would you write to trace the mismatch? (Simulation Mode)`
        ],
        'full-stack': [
          `How do you structure your backend API routes in ${langName} to handle database connection dropouts gracefully without causing client-side HTTP timeouts? (Simulation Mode)`,
          `Great. Now, let's talk about performance. If a React component takes 800ms to render a long list of items, what steps would you take in your code to make it smooth and responsive? (Simulation Mode)`,
          `Understood. Last question: How do you handle secrets, API keys, and configurations across local, staging, and production environments in a full stack deployment? (Simulation Mode)`
        ],
        'agentic-ai': [
          `When designing an autonomous AI Agent in ${langName}, how do you structure the tool schemas and the agent loop to prevent infinite tool-calling recursion or rate-limiting blockages? (Simulation Mode)`,
          `Excellent point. Let's discuss RAG pipelines. If your agent is retrieving irrelevant chunks from a Vector Database, how would you refine your embeddings search, metadata tagging, or context injection? (Simulation Mode)`,
          `Makes sense. Final question: How do you implement cost-guardrails, prompt-injection defense layers, and self-repair loops for an agent operating in a production workspace? (Simulation Mode)`
        ],
        'default': [
          `What design patterns or modular structures do you use in ${langName} to write testable and maintainable code? (Simulation Mode)`,
          `Nice. If your code is running slow (O(N^2) complexity) due to nested loops checking for duplicate elements, how would you refactor the logic to run in linear O(N) time? (Simulation Mode)`,
          `Got it. Last question: How do you handle errors, exceptions, and logging inside your production codebases to make debugging simple? (Simulation Mode)`
        ]
      }
    };

    const mockTurnCount = dialogueMessages.length - 1;

    const levelQuestions = questionsByLevel[level] || questionsByLevel['advanced'];
    let trackQuestions = [...(levelQuestions[goal] || levelQuestions['default'])];

    // Dynamically override simulation questions if keywords exist in candidate resume
    if (resumeText) {
      const lowerResume = resumeText.toLowerCase();
      if (lowerResume.includes('react')) {
        trackQuestions = trackQuestions.map(q => 
          q.toLowerCase().includes('react') || q.toLowerCase().includes('frontend') || q.toLowerCase().includes('click') || q.toLowerCase().includes('interface')
            ? `I noticed React in your resume. Tell me about the React project mentioned in your resume. (Simulation Mode)`
            : q
        );
      }
      if (lowerResume.includes('next.js') || lowerResume.includes('nextjs')) {
        trackQuestions = trackQuestions.map(q => 
          q.toLowerCase().includes('next.js') || q.toLowerCase().includes('nextjs') || q.toLowerCase().includes('http server') || q.toLowerCase().includes('api')
            ? `I see Next.js listed in your resume. Can you describe how you implemented routing or data fetching in your Next.js project? (Simulation Mode)`
            : q
        );
      }
      if (lowerResume.includes('node')) {
        trackQuestions = trackQuestions.map(q => 
          q.toLowerCase().includes('node') || q.toLowerCase().includes('backend') || q.toLowerCase().includes('http server') || q.toLowerCase().includes('database')
            ? `Since Node.js is on your resume, how did you structure the backend server or API endpoints for your projects? (Simulation Mode)`
            : q
        );
      }
    }

    const currentQuestionIndex = Math.floor(mockTurnCount / 2);

    const candidateMsg = message || '';

    if (currentQuestionIndex >= trackQuestions.length) {
      let codingLogic = 78;
      let communication = 82;
      let systemDesign = 75;
      let problemSolving = 80;

      const dialogueText = dialogueMessages.map((h: any) => h.message).join(' ');
      if (dialogueText.length > 500) {
        codingLogic += 8;
        communication += 6;
        systemDesign += 8;
        problemSolving += 7;
      }

      codingLogic = Math.min(98, codingLogic);
      communication = Math.min(98, communication);
      systemDesign = Math.min(98, systemDesign);
      problemSolving = Math.min(98, problemSolving);

      const overallScore = Math.round((codingLogic + communication + systemDesign + problemSolving) / 4);

      let strengths: string[] = [];
      let suggestions: string[] = [];
      
      const lastQuestionText = trackQuestions[trackQuestions.length - 1];
      const isStruggledOnLast = isDontKnowMsg(candidateMsg);
      let explanationText = '';
      if (isStruggledOnLast) {
        explanationText = `\n\n[Study Guide] Since you were unsure about the final question regarding this topic, here is a quick conceptual explanation to help you master it:\n${getQuestionExplanation(lastQuestionText, langName)}`;
      }

      let feedback = 'Completed mock interview in Simulation Mode.' + explanationText;

      if (goal === 'data-analyst') {
        feedback = `[Simulation Mode] You demonstrated a solid understanding of analytical principles in ${langName}, especially around resource-friendly dataset ingestion and joining strategies.` + explanationText;
        strengths = [
          'Excellent understanding of out-of-core file processing checks',
          'Good grasp of memory allocations during table merges',
          'Methodical approach to tracking down data visualization schema shifts'
        ];
        suggestions = [
          'Consider detailing specific dplyr/Pandas functions like chunksize or filter pipes to show syntax depth',
          'Explain statistical margins of error when interpreting visual metrics changes'
        ];
      } else if (goal === 'agentic-ai') {
        feedback = `[Simulation Mode] Strong technical depth in Agentic workflows. You structured agent loop guardrails, tool calls, and prompt safety boundaries effectively.` + explanationText;
        strengths = [
          'Clear implementation plan for preventing tool-calling infinite loops',
          'Good strategy for optimizing context retrieval in vector databases',
          'Awareness of prompt injection vectors and cost controls'
        ];
        suggestions = [
          'Detail Model Context Protocol (MCP) server resource permissions explicitly in client architectures',
          'Provide examples of self-repair code triggers using try-catch schema verification'
        ];
      } else {
        feedback = `[Simulation Mode] Great job completing the technical interview simulation! You communicated your coding strategies cleanly and designed solid modular error handling.` + explanationText;
        strengths = [
          'Solid application of structural patterns and clean scoping',
          'Accurate explanation of O(N) linear set lookup optimizations',
          'Proactive exception handling strategies'
        ];
        suggestions = [
          'Mention specific standard library helper classes or interfaces in your target language',
          'Incorporate unit testing frameworks (e.g. PyTest, JUnit, Mocha) in your verification pipelines'
        ];
      }

      // Save interviewer scorecard to database in mock mode
      if (isDbAvailable && session) {
        await supabase.from('logic2code_interview_dialogue_history').insert({
          session_id: session.id,
          role: 'interviewer',
          message: JSON.stringify({
            score: overallScore,
            metrics: { codingLogic, communication, systemDesign, problemSolving },
            feedback,
            strengths,
            suggestions
          })
        });
      }

      return NextResponse.json({
        isFinished: true,
        score: overallScore,
        metrics: {
          codingLogic,
          communication,
          systemDesign,
          problemSolving
        },
        feedback,
        strengths,
        suggestions,
        mode: 'simulation'
      });
    }

    const nextQuestion = trackQuestions[currentQuestionIndex];
    let finalQuestionResponse = nextQuestion;

    if (isDontKnowMsg(candidateMsg) && currentQuestionIndex > 0) {
      const prevQuestion = trackQuestions[currentQuestionIndex - 1];
      const explanation = getQuestionExplanation(prevQuestion, langName);
      finalQuestionResponse = `No problem! Let me explain that concept for you:\n\n${explanation}\n\nLet's move on to the next question:\n\n${nextQuestion}`;
    }

    // Save Interviewer Question to DB in mock mode
    if (isDbAvailable && session) {
      await supabase.from('logic2code_interview_dialogue_history').insert({
        session_id: session.id,
        role: 'interviewer',
        message: finalQuestionResponse
      });
    }

    return NextResponse.json({
      isFinished: false,
      question: finalQuestionResponse,
      mode: 'simulation'
    });
  } catch (err) {
    console.error('Failed to process Mock Interview request:', err);
    return NextResponse.json({ error: 'Failed to process Mock Interview request' }, { status: 500 });
  }
}
