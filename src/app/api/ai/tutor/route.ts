import { NextResponse } from 'next/server';
import { PROBLEMS } from '@/config/problems';
import { retrieveChunks, formatRAGContext } from '@/lib/rag/knowledgeBase';

// ── In-memory Rate Limiter ──────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  return false;
}

// Periodic cleanup to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore) {
    if (now > entry.resetAt) rateLimitStore.delete(ip);
  }
}, 5 * 60_000); // Cleanup every 5 minutes

export async function POST(request: Request) {
  // Extract IP for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a moment before sending more messages.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { selected_language, message, history, problemId, career_goal, experience_level } = body;

    const metadata = {
      selected_language: selected_language || 'Python',
      career_goal: career_goal || 'data-analyst',
      experience_level: experience_level || 'beginner',
      difficulty: body.difficulty || 'Beginner',
      problem_type: body.problem_type || 'Logic Building',
      user_level: body.user_level || 'Explorer'
    };

    const lang = metadata.selected_language.toLowerCase();
    const goal = metadata.career_goal.toLowerCase();
    const level = metadata.experience_level.toLowerCase();
    const langName = lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang === 'typescript' ? 'TypeScript' : lang.charAt(0).toUpperCase() + lang.slice(1);
    const goalName = goal.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Find active problem details if problemId is provided
    let problemDetails = null;
    if (problemId) {
      for (const langKey of Object.keys(PROBLEMS)) {
        const found = PROBLEMS[langKey].find((p: any) => p.id === problemId);
        if (found) {
          problemDetails = found;
          break;
        }
      }
    }

    // ── RAG Retrieval ────────────────────────────────────────────────────────
    const ragChunks = await retrieveChunks(message, lang, 3);
    const ragContext = formatRAGContext(ragChunks);
    const ragSources = ragChunks.map(c => ({ id: c.id, title: c.title }));

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      const systemPrompt = `You are an expert friendly programming tutor and learning coach.
The student is on the "${goalName}" career track, learning "${langName}".
The student's experience level is "${level}".
${problemDetails ? `
The student is currently working on the following coding problem:
- **Title**: ${problemDetails.title}
- **Description**: ${problemDetails.description}
- **Constraints**: ${problemDetails.constraints.join(', ')}
- **Input Specification**: ${problemDetails.inputSpec}
- **Output Specification**: ${problemDetails.outputSpec}

You should guide the student specifically on solving this problem. Keep in mind their experience level ("${level}") and selected language ("${langName}").` : ''}

${ragContext}
Your goal is to guide the student to build strong logic, syntax, and problem-solving skills:
1. Do NOT write the entire solution for the student immediately. Instead, explain the concepts, provide code snippets, or offer step-by-step guidance.
2. Tailor your explanation to their experience level:
   - For "beginner": Use simple terminology, explain basic syntax, loops, and control flow in ${langName}. Be very encouraging.
   - For "intermediate": Discuss standard functions, libraries (e.g. pandas/dplyr for data analysts, Express/React for full-stack, LangGraph/MCP/vector databases for agentic-ai), and simple optimization concepts.
   - For "advanced": Offer details about scalability, performance optimizations, memory patterns, concurrency, or advanced library features.
3. Keep your tone encouraging, pedagogical, and highly technical yet accessible. Use markdown formatting for code snippets.
4. Ground your answer in the retrieved knowledge base context above when relevant. Do not fabricate information.
5. If they ask about code, give them hints and code fragments instead of a copy-paste solution.

Few-shot training examples for your responses:
- Student: "How do I filter rows with Pandas?"
- Tutor: "In Pandas, we filter rows using boolean indexing. We write \`df[condition]\`. For example, if you want only rows where 'age' is greater than 20, you would do \`df[df['age'] > 20]\`. Try applying this to your sales data filter condition!"

- Student: "Explain difference between .loc and .iloc in Python"
- Tutor: "Sure! The key difference is label-based vs. integer-based indexing:
  1. \`.loc\` is label-based: you specify row and column names (e.g. \`df.loc[0, 'sales']\`).
  2. \`.iloc\` is integer-based: you use numerical positions (e.g. \`df.iloc[0, 2]\`).
  Which columns are you trying to reference in your active dataset?"`;

      const formattedHistory = (history || []).map((m: any) => {
        const roleName = m.role === 'user' ? 'Student' : 'Tutor';
        const text = m.parts?.[0]?.text || m.text || '';
        return `${roleName}: ${text}`;
      }).join('\n');

      const promptPayload = `System Instructions:
${systemPrompt}

Dialogue History:
${formattedHistory}

Student: ${message}
Tutor:`;

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
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (responseText) {
            return NextResponse.json({
              response: responseText,
              metadata: metadata,
              sources: ragSources
            });
          }
        } else {
          console.warn('Gemini API returned status:', response.status);
        }
      } catch (geminiErr) {
        console.error('Error invoking Gemini live endpoint for Tutor:', geminiErr);
      }
    }

    const msgLower = message.toLowerCase();
    let responseText = '';

    // Custom tutoring logic tailored to BOTH Career Goal + Programming Language
    if (goal === 'data-analyst' && lang === 'python') {
      if (msgLower.includes('how') || msgLower.includes('help') || msgLower.includes('explain') || msgLower.includes('code')) {
        responseText = `Since you are on the **Data Analyst** track learning **Python**, we will focus on tabular data wrangling. In Python, you can utilize the \`pandas\` library to clean and query datasets:
1. Initialize your data metrics or default categories.
2. Iterate through lists using Python loops, or load them into a \`pandas.DataFrame\` or \`pandas.Series\` structure.
3. Clean nulls using methods like \`.fillna()\` or \`.dropna()\` which translate directly to SQL \`COALESCE\` filters.
Let's make sure we structure our algorithm cleanly to keep Excel spreadsheet row translations clear!`;
      } else {
        responseText = `Got it! Let's think about Python for Data Analysis. We can leverage Pandas DataFrames, clean null parameters, or write SQL-like queries. How would you like to structure this analytical logic?`;
      }
    } else if (goal === 'data-analyst' && lang === 'r') {
      if (msgLower.includes('how') || msgLower.includes('help') || msgLower.includes('explain') || msgLower.includes('code')) {
        responseText = `Since you are on the **Data Analyst** track learning **R**, we will focus on statistical computing and dataframes. In R, you can utilize the \`dplyr\` and \`ggplot2\` libraries:
1. Load your variables into vectors or a \`data.frame\` structure.
2. Clean missing data with functions like \`is.na()\` or \`tidyr::replace_na()\`.
3. Filter rows using \`filter()\` and aggregate metrics using \`summarise()\` or \`mean(..., na.rm = TRUE)\`.
Let's make sure we structure our algorithm cleanly to keep Excel logic translations clear!`;
      } else {
        responseText = `Got it! Let's think about R for Data Analysis. We can leverage R data.frames, dplyr pipes (\`%>\%\` or \`|>\`), and ggplot2 charts. How would you like to structure this analytical logic?`;
      }
    } else if (goal === 'full-stack' && (lang === 'javascript' || lang === 'typescript')) {
      if (msgLower.includes('how') || msgLower.includes('help') || msgLower.includes('explain') || msgLower.includes('code')) {
        responseText = `Since you are on the **Full Stack Developer** track learning **JavaScript**, we will connect front-end rendering with backend routes. In JavaScript:
1. We can write an API route handling Express request bodies (POST/GET).
2. Validate user sessions, and connect to a mock database collection (similar to MongoDB or SQL).
3. If this were a React component, we would fetch this API asynchronously using \`useEffect\` or React Server Components.
Let's design a clean REST API structure that validates inputs before executing!`;
      } else {
        responseText = `Understood! As a Full Stack developer, you will manage React components, API fetches, and database storage. How should we configure the client-server logic for this coding challenge?`;
      }
    } else if (goal === 'agentic-ai' && lang === 'python') {
      if (msgLower.includes('how') || msgLower.includes('help') || msgLower.includes('explain') || msgLower.includes('code')) {
        responseText = `Since you are on the **Agentic AI Engineer** track learning **Python**, we are building autonomous AI architectures. In Python, you can orchestrate multi-agent logic or MCP tool-calling servers:
1. Define a system instructions prompt using zero-shot / few-shot configurations.
2. In RAG pipelines, embed text chunks and query a Vector Database (like Chroma or Pinecone).
3. Connect the agent to external tools via the Model Context Protocol (MCP) schema.
Let's structure a clean loop that monitors cost budgets and prevents infinite routing loops!`;
      } else {
        responseText = `Perfect! Developing Agentic AI systems in Python involves configuring prompt templates, vector databases (RAG), tool schemas, and multi-agent frameworks (CrewAI/LangGraph). How can we align your logic loops here?`;
      }
    } else {
      // General fallbacks for other tracks and languages
      const goalName = goal.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const langName = lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1);
      
      responseText = `Hello! As a aspiring **${goalName}** using **${langName}**, we want to build clean, maintainable logic:
- Leverage ${langName} libraries matching ${goalName} standards.
- Add validations to prevent errors.
- Ensure efficient iterations.
Tell me what code or logic you'd like to implement!`;
    }

    return NextResponse.json({
      response: responseText,
      metadata: metadata,
      sources: ragSources
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process AI Tutor request' }, { status: 500 });
  }
}
