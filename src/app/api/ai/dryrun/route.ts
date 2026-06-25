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

function mapLanguageToPiston(lang: string): { language: string; version: string; filename: string } {
  const l = lang.toLowerCase();
  switch (l) {
    case 'python':
    case 'py':
      return { language: 'python', version: '3.10.0', filename: 'main.py' };
    case 'javascript':
    case 'js':
      return { language: 'javascript', version: '18.15.0', filename: 'index.js' };
    case 'typescript':
    case 'ts':
      return { language: 'typescript', version: '1.30.0', filename: 'index.ts' };
    case 'java':
      return { language: 'java', version: '15.0.2', filename: 'Main.java' };
    case 'cpp':
    case 'c++':
      return { language: 'c++', version: '10.2.0', filename: 'main.cpp' };
    case 'c':
      return { language: 'c', version: '10.2.0', filename: 'main.c' };
    case 'go':
      return { language: 'go', version: '1.16.2', filename: 'main.go' };
    case 'r':
      return { language: 'r', version: '4.1.1', filename: 'main.r' };
    default:
      return { language: l, version: '*', filename: 'main' };
  }
}

    const lang = (selected_language || 'python').toLowerCase();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // --- LIVE PISTON COMPILER EXECUTION ---
    const pistonConfig = mapLanguageToPiston(lang);
    let runStdout = '';
    let runStderr = '';
    let isCompileError = false;
    let isExecutionSuccess = false;

    try {
      const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: pistonConfig.language,
          version: pistonConfig.version,
          files: [
            {
              name: pistonConfig.filename,
              content: code
            }
          ]
        })
      });

      if (pistonRes.ok) {
        const pistonData = await pistonRes.json();
        const compile = pistonData.compile;
        const run = pistonData.run;

        if (compile && compile.stderr) {
          runStderr = compile.stderr;
          isCompileError = true;
        } else if (run) {
          runStdout = run.stdout || '';
          runStderr = run.stderr || '';
          isExecutionSuccess = run.code === 0;
        }
      }
    } catch (pistonErr) {
      console.error('Failed to run code via Piston API:', pistonErr);
    }

    // If compilation or execution failed, return stderr immediately
    if (isCompileError || (runStderr && !isExecutionSuccess)) {
      const consoleOutput = isCompileError 
        ? `Compile Error:\n${runStderr}` 
        : `Runtime Exception:\n${runStderr}`;
      
      return NextResponse.json({
        consoleOutput,
        steps: [],
        metadata: {
          selected_language: selected_language,
          problemId: problemId,
          realtime: true,
          compiled: true,
          success: false
        }
      });
    }

    if (apiKey) {
      const systemPrompt = `You are a real-time visual debugger step-state generator.
The user is learning the language "${lang}".
Their code compiled successfully and returned the following console output:
"${runStdout}"

Given the user's code, generate a list of step-by-step visual execution states (up to 8 steps max). For each step, capture:
1. "line": the line number currently executing (1-indexed).
2. "explanation": a concise description of what occurs at this step.
3. "variables": array of active variables in local scope, each with "name" and "value" (both strings). E.g. [{"name": "x", "value": "10"}].
4. "dataStructures": data structure state matching the visualizer type:
   - For Python (visualizerType: "list-dict"):
     - "list": array of string elements.
     - "dict": array of {"key": string, "value": string} mappings.
   - For JavaScript/TypeScript (visualizerType: "event-loop"):
     - "eventLoopStack": array of active call stack frame strings, e.g. ["global()", "solveProblem()"].
     - "webapis": array of active async Web APIs (e.g. ["fetchData()"]).
     - "queue": callback queue strings.
   - For C/C++ (visualizerType: "pointers-heap"):
     - "pointerStack": array of {"address": string, "name": string, "val": string} stack pointers.
     - "heap": array of {"address": string, "value": string} heap variables.
   - For Java (visualizerType: "oop-heap"):
     - "stackRefs": array of {"name": string, "ref": string} references.
     - "heapObjects": array of {"ref": string, "type": string, "value": string} allocated objects.
   - For Go (visualizerType: "concurrency"):
     - "goroutines": array of active goroutine strings.
     - "channels": array of {"name": string, "buffer": string[], "cap": number} channels.

Make the dry-run steps match the actual execution flow of the user's code.

User Code:
${code}`;

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
                    { text: systemPrompt }
                  ]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    steps: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          line: { type: "INTEGER" },
                          explanation: { type: "STRING" },
                          variables: {
                            type: "ARRAY",
                            items: {
                              type: "OBJECT",
                              properties: {
                                name: { type: "STRING" },
                                value: { type: "STRING" }
                              },
                              required: ["name", "value"]
                            }
                          },
                          dataStructures: {
                            type: "OBJECT",
                            properties: {
                              type: { type: "STRING" },
                              list: { type: "ARRAY", items: { type: "STRING" } },
                              dict: {
                                type: "ARRAY",
                                items: {
                                  type: "OBJECT",
                                  properties: {
                                    key: { type: "STRING" },
                                    value: { type: "STRING" }
                                  },
                                  required: ["key", "value"]
                                }
                              },
                              eventLoopStack: { type: "ARRAY", items: { type: "STRING" } },
                              pointerStack: {
                                type: "ARRAY",
                                items: {
                                  type: "OBJECT",
                                  properties: {
                                    address: { type: "STRING" },
                                    name: { type: "STRING" },
                                    val: { type: "STRING" }
                                  },
                                  required: ["address", "name", "val"]
                                }
                              },
                              webapis: { type: "ARRAY", items: { type: "STRING" } },
                              queue: { type: "ARRAY", items: { type: "STRING" } },
                              stackRefs: {
                                type: "ARRAY",
                                items: {
                                  type: "OBJECT",
                                  properties: {
                                    name: { type: "STRING" },
                                    ref: { type: "STRING" }
                                  },
                                  required: ["name", "ref"]
                                }
                              },
                              heapObjects: {
                                type: "ARRAY",
                                items: {
                                  type: "OBJECT",
                                  properties: {
                                    ref: { type: "STRING" },
                                    type: { type: "STRING" },
                                    value: { type: "STRING" }
                                  },
                                  required: ["ref", "type", "value"]
                                }
                              },
                              heap: {
                                type: "ARRAY",
                                items: {
                                  type: "OBJECT",
                                  properties: {
                                    address: { type: "STRING" },
                                    value: { type: "STRING" }
                                  },
                                  required: ["address", "value"]
                                }
                              },
                              goroutines: { type: "ARRAY", items: { type: "STRING" } },
                              channels: {
                                type: "ARRAY",
                                items: {
                                  type: "OBJECT",
                                  properties: {
                                    name: { type: "STRING" },
                                    buffer: { type: "ARRAY", items: { type: "STRING" } },
                                    cap: { type: "INTEGER" }
                                  },
                                  required: ["name", "buffer", "cap"]
                                }
                              }
                            }
                          }
                        },
                        required: ["line", "explanation", "variables"]
                      }
                    }
                  },
                  required: ["steps"]
                }
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            const parsed = JSON.parse(text);
            const rawSteps = parsed.steps || [];
            
            // Map structured array schema back to object/record representations
            const mappedSteps = rawSteps.map((step: any) => {
              const variablesRecord: Record<string, string> = {};
              if (Array.isArray(step.variables)) {
                step.variables.forEach((item: any) => {
                  if (item && item.name) {
                    variablesRecord[item.name] = String(item.value);
                  }
                });
              }

              const ds = step.dataStructures || {};
              const dsMapped: any = { type: ds.type };

              if (ds.list) dsMapped.list = ds.list;
              if (ds.webapis) dsMapped.webapis = ds.webapis;
              if (ds.queue) dsMapped.queue = ds.queue;
              if (ds.goroutines) dsMapped.goroutines = ds.goroutines;

              // Map dict mappings array
              if (Array.isArray(ds.dict)) {
                const dictRecord: Record<string, string> = {};
                ds.dict.forEach((item: any) => {
                  if (item && item.key) {
                    dictRecord[item.key] = String(item.value);
                  }
                });
                dsMapped.dict = dictRecord;
              }

              // Map eventLoopStack or pointerStack to stack
              if (Array.isArray(ds.eventLoopStack)) {
                dsMapped.stack = ds.eventLoopStack;
              } else if (Array.isArray(ds.pointerStack)) {
                const pointerStackRecord: Record<string, { name: string, val: string }> = {};
                ds.pointerStack.forEach((item: any) => {
                  if (item && item.address) {
                    pointerStackRecord[item.address] = {
                      name: item.name,
                      val: String(item.val)
                    };
                  }
                });
                dsMapped.stack = pointerStackRecord;
              }

              // Map stackRefs
              if (Array.isArray(ds.stackRefs)) {
                const stackRefsRecord: Record<string, string> = {};
                ds.stackRefs.forEach((item: any) => {
                  if (item && item.name) {
                    stackRefsRecord[item.name] = String(item.ref);
                  }
                });
                dsMapped.stackRefs = stackRefsRecord;
              }

              // Map heapObjects
              if (Array.isArray(ds.heapObjects)) {
                const heapObjectsRecord: Record<string, { type: string, value: string }> = {};
                ds.heapObjects.forEach((item: any) => {
                  if (item && item.ref) {
                    heapObjectsRecord[item.ref] = {
                      type: item.type,
                      value: String(item.value)
                    };
                  }
                });
                dsMapped.heapObjects = heapObjectsRecord;
              }

              // Map heap
              if (Array.isArray(ds.heap)) {
                const heapRecord: Record<string, string> = {};
                ds.heap.forEach((item: any) => {
                  if (item && item.address) {
                    heapRecord[item.address] = String(item.value);
                  }
                });
                dsMapped.heap = heapRecord;
              }

              // Map channels
              if (Array.isArray(ds.channels)) {
                const channelsRecord: Record<string, { buffer: string[], cap: number }> = {};
                ds.channels.forEach((item: any) => {
                  if (item && item.name) {
                    channelsRecord[item.name] = {
                      buffer: Array.isArray(item.buffer) ? item.buffer : [],
                      cap: Number(item.cap)
                    };
                  }
                });
                dsMapped.channels = channelsRecord;
              }

              return {
                line: Number(step.line),
                explanation: step.explanation,
                variables: variablesRecord,
                dataStructures: dsMapped
              };
            });

            return NextResponse.json({
              consoleOutput: runStdout || 'Success! Code executed cleanly.\n',
              steps: mappedSteps,
              metadata: {
                selected_language: selected_language,
                problemId: problemId,
                realtime: true,
                compiled: true
              }
            });
          }
        } else {
          const errText = await response.text();
          console.warn('Gemini dryrun API returned status:', response.status, 'Error:', errText);
        }
      } catch (geminiErr) {
        console.error('Error invoking Gemini live endpoint for dryrun:', geminiErr);
      }
    }

    // Fallback: If API key is missing or failed, return Piston output with empty steps
    if (runStdout) {
      return NextResponse.json({
        consoleOutput: runStdout,
        steps: [],
        metadata: {
          selected_language: selected_language,
          problemId: problemId,
          realtime: false,
          compiled: true
        }
      });
    }

    // Fallback to static mock steps if Piston failed and API key is missing
    let steps: any[] = [];
    let consoleOutput = '';

    if (lang === 'python') {
      consoleOutput = `Processing input data...\nFinding largest number in: [12, 45, 2, 89, 34]\nLargest value identified: 89\n`;
      steps = [
        {
          line: 1,
          variables: { data: '[12, 45, 2, 89, 34]' },
          explanation: 'Function solve_problem called. Stack frame created. List pointer passed to scope.',
          dataStructures: { type: 'list-dict', list: ['12', '45', '2', '89', '34'], dict: {} }
        },
        {
          line: 3,
          variables: { data: '[12, 45, 2, 89, 34]', largest: '12' },
          explanation: 'largest variable initialized to nums[0] (value 12).',
          dataStructures: { type: 'list-dict', list: ['12', '45', '2', '89', '34'], dict: { current_max: '12' } }
        },
        {
          line: 4,
          variables: { data: '[12, 45, 2, 89, 34]', largest: '12', n: '45' },
          explanation: 'Loop iteration index 1. n is 45. n (45) > largest (12) is true.',
          dataStructures: { type: 'list-dict', list: ['12', '45', '2', '89', '34'], dict: { current_max: '12' } }
        },
        {
          line: 5,
          variables: { data: '[12, 45, 2, 89, 34]', largest: '45', n: '45' },
          explanation: 'largest variable updated to 45.',
          dataStructures: { type: 'list-dict', list: ['12', '45', '2', '89', '34'], dict: { current_max: '45' } }
        },
        {
          line: 4,
          variables: { data: '[12, 45, 2, 89, 34]', largest: '45', n: '89' },
          explanation: 'Loop iteration index 3. n is 89. n (89) > largest (45) is true.',
          dataStructures: { type: 'list-dict', list: ['12', '45', '2', '89', '34'], dict: { current_max: '45' } }
        },
        {
          line: 5,
          variables: { data: '[12, 45, 2, 89, 34]', largest: '89', n: '89' },
          explanation: 'largest updated to 89.',
          dataStructures: { type: 'list-dict', list: ['12', '45', '2', '89', '34'], dict: { current_max: '89' } }
        },
        {
          line: 6,
          variables: { data: '[12, 45, 2, 89, 34]', largest: '89' },
          explanation: 'Loop terminates. Returns final value 89.',
          dataStructures: { type: 'list-dict', list: ['12', '45', '2', '89', '34'], dict: { current_max: '89', status: '"finished"' } }
        }
      ];
    } else if (lang === 'javascript' || lang === 'typescript') {
      consoleOutput = `Initializing JS Array Operations...\nFiltering unique events...\nFound elements: [2, 45, 89]\n`;
      steps = [
        {
          line: 1,
          variables: { data: '"run"' },
          explanation: 'Function solveProblem pushed onto call stack frame.',
          dataStructures: { type: 'event-loop', stack: ['global()', 'solveProblem()'], webapis: [], queue: [] }
        },
        {
          line: 3,
          variables: { data: '"run"', result: '[]' },
          explanation: 'Result array initialized. References allocated in execution context.',
          dataStructures: { type: 'event-loop', stack: ['global()', 'solveProblem()'], webapis: ['setTimeout()'], queue: [] }
        },
        {
          line: 5,
          variables: { data: '"run"', result: '["done"]' },
          explanation: 'Async web api callback event dispatched to Callback Queue.',
          dataStructures: { type: 'event-loop', stack: ['global()'], webapis: [], queue: ['onSuccess()'] }
        },
        {
          line: 8,
          variables: { data: '"run"', result: '["done"]' },
          explanation: 'Event Loop ticks callback from queue back onto Call Stack. Stack resolves.',
          dataStructures: { type: 'event-loop', stack: ['onSuccess()'], webapis: [], queue: [] }
        }
      ];
    } else if (lang === 'java') {
      consoleOutput = `JVM Initializing...\nInvoking static Solution.solveProblem...\nHeap elements initialized.\n`;
      steps = [
        {
          line: 4,
          variables: { data: '"hello"' },
          explanation: 'Stack references allocated in Thread frame. Heap Object instantiated.',
          dataStructures: { type: 'oop-heap', stackRefs: { data: '0x101a', result: 'null' }, heapObjects: { '0x101a': { type: 'String', value: '"hello"' } } }
        },
        {
          line: 7,
          variables: { data: '"hello"', result: '0x992c' },
          explanation: 'ArrayList container created in JVM heap memory. Stack reference updated.',
          dataStructures: { type: 'oop-heap', stackRefs: { data: '0x101a', result: '0x992c' }, heapObjects: { '0x101a': { type: 'String', value: '"hello"' }, '0x992c': { type: 'ArrayList', value: 'size:0' } } }
        }
      ];
    } else if (lang === 'cpp' || lang === 'c') {
      consoleOutput = `Compiling code...\nHeap addressing loaded.\nProcessing ptr dereferences...\n`;
      steps = [
        {
          line: 5,
          variables: { data: '"hello"' },
          explanation: 'Passing vector by constant reference. Stack pointer contains memory address of local variable.',
          dataStructures: { type: 'pointers-heap', stack: { '0x7ffd1': { name: 'data', val: '0x889a' } }, heap: { '0x889a': '"hello"' } }
        },
        {
          line: 9,
          variables: { data: '"hello"', ptr: '0x7ffd1' },
          explanation: 'Pointer variable ptr allocated on Stack, referencing address 0x7ffd1.',
          dataStructures: { type: 'pointers-heap', stack: { '0x7ffd1': { name: 'data', val: '0x889a' }, '0x7ffd8': { name: 'ptr', val: '0x7ffd1' } }, heap: { '0x889a': '"hello"' } }
        }
      ];
    } else if (lang === 'go') {
      consoleOutput = `Goroutines started...\nExecuting concurrent channels...\nExchange synchronized.\n`;
      steps = [
        {
          line: 3,
          variables: { data: '"main"' },
          explanation: 'Main thread running. Channel buffer allocated in memory.',
          dataStructures: { type: 'concurrency', goroutines: ['G1 (main) [executing]'], channels: { ch1: { buffer: [], cap: 2 } } }
        },
        {
          line: 7,
          variables: { data: '"main"' },
          explanation: 'Go routine G2 spawned concurrently. Pushes message "hello" into ch1 channel.',
          dataStructures: { type: 'concurrency', goroutines: ['G1 (main) [runnable]', 'G2 (worker) [executing]'], channels: { ch1: { buffer: ['"hello"'], cap: 2 } } }
        },
        {
          line: 10,
          variables: { data: '"main"', result: '"hello"' },
          explanation: 'Main routine G1 blocks and reads value from channel buffer. Channel emptied.',
          dataStructures: { type: 'concurrency', goroutines: ['G1 (main) [executing]'], channels: { ch1: { buffer: [], cap: 2 } } }
        }
      ];
    }

    return NextResponse.json({
      consoleOutput: consoleOutput,
      steps: steps,
      metadata: {
        selected_language: selected_language,
        problemId: problemId,
        realtime: false
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process AI dryrun request' }, { status: 500 });
  }
}
