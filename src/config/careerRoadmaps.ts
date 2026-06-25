export interface CareerTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const CAREER_TRACKS: CareerTrack[] = [
  { id: 'full-stack', name: 'Full Stack Developer', description: 'Build end-to-end client and server applications.', icon: 'Layers' },
  { id: 'frontend', name: 'Frontend Developer', description: 'Design interactive, beautiful, and responsive web user interfaces.', icon: 'Layout' },
  { id: 'backend', name: 'Backend Developer', description: 'Architect robust databases, server APIs, and scale backend architectures.', icon: 'Database' },
  { id: 'data-analyst', name: 'Data Analyst', description: 'Clean data, perform queries, and build visual metrics dashboards.', icon: 'BarChart' },
  { id: 'data-scientist', name: 'Data Scientist', description: 'Train predictive models, run statistical tests, and explore datasets.', icon: 'Brain' },
  { id: 'data-engineer', name: 'Data Engineer', description: 'Build pipelines, structure warehouses, and manage Big Data flows.', icon: 'Cpu' },
  { id: 'qa-automation', name: 'QA Automation Engineer', description: 'Write automation test suites, check endpoints, and monitor releases.', icon: 'CheckSquare' },
  { id: 'ai-engineer', name: 'AI Engineer', description: 'Integrate LLMs, orchestrate prompts, and build neural pipelines.', icon: 'Sparkles' },
  { id: 'agentic-ai', name: 'Agentic AI Engineer', description: 'Develop autonomous AI Agents, Multi-Agent architectures, and MCP servers.', icon: 'Bot' },
  { id: 'devops', name: 'DevOps Engineer', description: 'Orchestrate clouds, set up CI/CD workflows, and monitor systems.', icon: 'Server' },
  { id: 'cyber-security', name: 'Cyber Security Engineer', description: 'Audit codebases, secure networks, and protect infrastructure systems.', icon: 'Shield' }
];

export const EXPERIENCE_LEVELS = [
  { id: 'beginner', name: 'Beginner', description: 'Starting fresh. Learn syntax, basic concepts, and foundational tools.' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some coding experience. Focus on system logic, libraries, and frameworks.' },
  { id: 'advanced', name: 'Advanced', description: 'Experienced coder. Deep dive into optimization, design patterns, and scaling.' }
];

export interface CareerRoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'module' | 'project' | 'assessment' | 'milestone' | 'interview' | 'certificate';
  status: 'locked' | 'unlocked' | 'completed';
  x: number;
  y: number;
  xpReward: number;
  objectives: string[];
}

// Helper to generate coordinates in a winding path
const getCoordinates = (idx: number) => {
  const xCoords = [200, 150, 250, 200, 300, 150, 250, 200, 150, 200];
  return {
    x: xCoords[idx % xCoords.length],
    y: 50 + idx * 100
  };
};

function generateRawCareerRoadmap(
  careerGoal: string,
  language: string,
  experienceLevel: string
): CareerRoadmapNode[] {
  const langName = language === 'cpp' ? 'C++' : language === 'javascript' ? 'JavaScript' : language === 'typescript' ? 'TypeScript' : language.charAt(0).toUpperCase() + language.slice(1);
  const track = CAREER_TRACKS.find(t => t.id === careerGoal) || CAREER_TRACKS[0];

  // Specific content mapping for main combinations, with dynamic fallbacks
  if (careerGoal === 'data-analyst') {
    return [
      {
        id: 'da-1',
        title: `Core ${langName} for Analytics`,
        description: `Learn syntax, variables, lists, and file loops adapted for analysis.`,
        type: 'module',
        status: 'completed',
        ...getCoordinates(0),
        xpReward: 100,
        objectives: ['Data type declarations', 'Reading CSV/JSON files', 'Writing helper calculations']
      },
      {
        id: 'da-2',
        title: 'Excel & Data Concepts',
        description: 'Understand tabular structures, sheets, lookups, and clean schemas.',
        type: 'module',
        status: 'unlocked',
        ...getCoordinates(1),
        xpReward: 100,
        objectives: ['Row-column structuring', 'Lookup translations', 'Data schema modeling']
      },
      {
        id: 'da-3',
        title: `SQL Queries & Databases`,
        description: 'Write SELECTs, JOINs, aggregations, and subqueries.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(2),
        xpReward: 100,
        objectives: ['INNER and LEFT joins', 'GROUP BY and SUM aggregates', 'Subquery filtration']
      },
      {
        id: 'da-4',
        title: 'SQL & Queries Assessment',
        description: 'Test your database retrieval and joining capabilities.',
        type: 'assessment',
        status: 'locked',
        ...getCoordinates(3),
        xpReward: 150,
        objectives: ['Query completion task', 'Join optimization test', 'Aggregate verification']
      },
      {
        id: 'da-5',
        title: language === 'r' ? 'dplyr & Data Cleaning in R' : `Pandas & Data Cleaning in ${langName}`,
        description: language === 'r' ? 'Import data.frames, clean nulls using dplyr, format columns, and clean datasets.' : 'Import dataframes, clean nulls, format columns, and clean datasets.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(4),
        xpReward: 150,
        objectives: language === 'r' ? ['Handling NA values', 'mutate() and select() operations', 'group_by() and summarise() calculations'] : ['Handling missing values', 'Dataframe column casts', 'Groupby calculations']
      },
      {
        id: 'da-6',
        title: 'Data Wrangler Milestone',
        description: 'Verify your core data manipulation foundations.',
        type: 'milestone',
        status: 'locked',
        ...getCoordinates(5),
        xpReward: 200,
        objectives: ['Complete cleaning roadmap block', 'Wrangle 10k rows list', 'Unlocking secondary tracks']
      },
      {
        id: 'da-7',
        title: 'E-commerce Data Cleaning Project',
        description: 'Perform end-to-end data auditing, null removals, and exports on sales logs.',
        type: 'project',
        status: 'locked',
        ...getCoordinates(6),
        xpReward: 300,
        objectives: ['Load sales CSV', 'Merge customer details logs', 'Export cleaned CSV tables']
      },
      {
        id: 'da-8',
        title: `Data Visualization Principles`,
        description: 'Plot charts, line graphs, bar charts, and plot summaries.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(7),
        xpReward: 100,
        objectives: ['Bar and pie charts', 'Trend graphs plotting', 'Designing legible dashboards']
      },
      {
        id: 'da-9',
        title: 'Analyst Interview Preparation',
        description: 'Review core questions, statistics, and live coding exercises.',
        type: 'interview',
        status: 'locked',
        ...getCoordinates(8),
        xpReward: 150,
        objectives: ['SQL mock whiteboard tasks', 'Explain standard deviations', 'Presenting data stories']
      },
      {
        id: 'da-10',
        title: 'Certified Data Analyst Certificate',
        description: 'Receive your verified credential showing analytical mastery.',
        type: 'certificate',
        status: 'locked',
        ...getCoordinates(9),
        xpReward: 250,
        objectives: ['Verify all milestones', 'Submit capstone code', 'Claim digital badge']
      }
    ];
  }

  if (careerGoal === 'full-stack') {
    return [
      {
        id: 'fs-1',
        title: `Modern ${langName} Foundations`,
        description: 'Master dynamic loops, structural data variables, and async features.',
        type: 'module',
        status: 'completed',
        ...getCoordinates(0),
        xpReward: 100,
        objectives: [`ES6+ scoping and syntax`, `Async flow control`, `Data collections`]
      },
      {
        id: 'fs-2',
        title: 'Backend Node.js & HTTP Servers',
        description: 'Set up listening servers, routers, and request handles.',
        type: 'module',
        status: 'unlocked',
        ...getCoordinates(1),
        xpReward: 100,
        objectives: ['HTTP response headers', 'Routing requests parameters', 'Middleware setups']
      },
      {
        id: 'fs-3',
        title: 'REST API & Router Design',
        description: 'Create clean GET, POST, PUT, DELETE RESTful routing networks.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(2),
        xpReward: 100,
        objectives: ['JSON formats outputs', 'Status code configurations', 'Validation middleware']
      },
      {
        id: 'fs-4',
        title: 'RESTful Routing Assessment',
        description: 'Test API routing safety, parameters, and error handlers.',
        type: 'assessment',
        status: 'locked',
        ...getCoordinates(3),
        xpReward: 150,
        objectives: ['Secure route checks', 'Validate post body models', 'Mock error stack tests']
      },
      {
        id: 'fs-5',
        title: 'React UI Components Layout',
        description: 'Learn component design, state bindings, props, and hooks.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(4),
        xpReward: 150,
        objectives: ['Functional components hook lifecycle', 'State mutations flow', 'Passing props parameters']
      },
      {
        id: 'fs-6',
        title: 'Full Stack core Milestone',
        description: 'Verify client UI rendering and API communication loops.',
        type: 'milestone',
        status: 'locked',
        ...getCoordinates(5),
        xpReward: 200,
        objectives: ['Integrate React fetch lifecycle', 'Verify cookie credentials', 'Cross-origin policy setup']
      },
      {
        id: 'fs-7',
        title: 'MERN E-Commerce Store Project',
        description: 'Build a catalog store with MongoDB databases, Node.js API server, and React UI.',
        type: 'project',
        status: 'locked',
        ...getCoordinates(6),
        xpReward: 300,
        objectives: ['Define schema items collections', 'Build checkout API models', 'Create UI cart selectors']
      },
      {
        id: 'fs-8',
        title: 'Database Integrations & Queries',
        description: 'Connect databases, create schemas, run queries, and optimize joins.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(7),
        xpReward: 100,
        objectives: ['SQL vs NoSQL decisions', 'Define table structures and indexes', 'Write joining procedures']
      },
      {
        id: 'fs-9',
        title: 'Full Stack Whiteboard Prep',
        description: 'Practice system design, data architectures, and algorithms.',
        type: 'interview',
        status: 'locked',
        ...getCoordinates(8),
        xpReward: 150,
        objectives: ['Scale API traffic sessions', 'Draw architecture diagrams', 'Optimize array algorithms']
      },
      {
        id: 'fs-10',
        title: 'Certified Full Stack Engineer',
        description: 'Claim your certification showing full stack system mastery.',
        type: 'certificate',
        status: 'locked',
        ...getCoordinates(9),
        xpReward: 250,
        objectives: ['Deploy client and api live', 'Complete database load test', 'Verify digital signature']
      }
    ];
  }

  if (careerGoal === 'agentic-ai') {
    return [
      {
        id: 'ai-1',
        title: 'Prompt Engineering & LLMs',
        description: `Learn system instruction formatting, parsing variables, and model bounds using ${langName}.`,
        type: 'module',
        status: 'completed',
        ...getCoordinates(0),
        xpReward: 100,
        objectives: ['Zero-shot and few-shot formatting', 'System instructions structure', 'Structured JSON outputs parsing']
      },
      {
        id: 'ai-2',
        title: 'RAG Pipelines & Text Embeddings',
        description: 'Vectorize text chunks, calculate cosine similarities, and inject context.',
        type: 'module',
        status: 'unlocked',
        ...getCoordinates(1),
        xpReward: 100,
        objectives: ['Chuncking algorithms models', 'Calculate embeddings vectors', 'Adding context window injection']
      },
      {
        id: 'ai-3',
        title: 'Vector Database Integrations',
        description: 'Index vector metrics, query nearest neighbors, and store document nodes.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(2),
        xpReward: 100,
        objectives: ['Metadata indexing models', 'Semantic query execution', 'Upserting dataset files']
      },
      {
        id: 'ai-4',
        title: 'RAG & Vector Retrieval Quiz',
        description: 'Assess vector similarity index math, chunk layouts, and retrieve efficiency.',
        type: 'assessment',
        status: 'locked',
        ...getCoordinates(3),
        xpReward: 150,
        objectives: ['Verify cosine formulas', 'Audit metadata filters', 'Solve context overflow checks']
      },
      {
        id: 'ai-5',
        title: 'AI Tool Calling & Agents',
        description: 'Equip models with executable function definitions and logic hooks.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(4),
        xpReward: 150,
        objectives: ['Define JSON tool schemas', 'Handle call redirection variables', 'Logic loop verification']
      },
      {
        id: 'ai-6',
        title: 'Model Context Protocol (MCP) Setup',
        description: 'Connect models to local filesystems, directories, and web client servers.',
        type: 'module',
        status: 'locked',
        ...getCoordinates(5),
        xpReward: 150,
        objectives: ['Configure MCP server tools', 'Setup schema endpoints parameters', 'Author custom resource types']
      },
      {
        id: 'ai-7',
        title: 'Multi-Agent Frameworks Project',
        description: 'Build a multi-agent system resolving complex research tasks using CrewAI or LangGraph.',
        type: 'project',
        status: 'locked',
        ...getCoordinates(6),
        xpReward: 300,
        objectives: ['Declare research and reviewer agent roles', 'Create state-machine graph routers', 'Execute task queues pipelines']
      },
      {
        id: 'ai-8',
        title: 'Agentic Systems Milestone',
        description: 'Verify system feedback loops, guardrails, and autonomous execution.',
        type: 'milestone',
        status: 'locked',
        ...getCoordinates(7),
        xpReward: 200,
        objectives: ['Setup self-repair code hooks', 'Implement cost limits guardrails', 'Verify task loop terminations']
      },
      {
        id: 'ai-9',
        title: 'Agentic Architect Interview QA',
        description: 'Practice whiteboard designs for stateful agents, MCP pipelines, and safety structures.',
        type: 'interview',
        status: 'locked',
        ...getCoordinates(8),
        xpReward: 150,
        objectives: ['Scale agent task execution queues', 'Handle vector index retrieval lag', 'Explain prompt defense systems']
      },
      {
        id: 'ai-10',
        title: 'Certified Agentic AI Architect',
        description: 'Receive your verification badge showing multi-agent system expertise.',
        type: 'certificate',
        status: 'locked',
        ...getCoordinates(9),
        xpReward: 250,
        objectives: ['Verify code templates compilation', 'Confirm database state logs schemas', 'Submit capstone design']
      }
    ];
  }

  // Dynamic fallback generator for all other tracks
  return [
    {
      id: `${careerGoal}-1`,
      title: `${track.name} Core syntax`,
      description: `Master variables, logic loops, and key data libraries for ${track.name} in ${langName}.`,
      type: 'module',
      status: 'completed',
      ...getCoordinates(0),
      xpReward: 100,
      objectives: ['Standard language syntax', 'Define variables structure', 'Solve logic loops']
    },
    {
      id: `${careerGoal}-2`,
      title: `${track.name} Frameworks`,
      description: `Understand the major libraries and packages for ${track.name}.`,
      type: 'module',
      status: 'unlocked',
      ...getCoordinates(1),
      xpReward: 100,
      objectives: ['Import standard packages', 'Initialize configurations', 'Handle interface requests']
    },
    {
      id: `${careerGoal}-3`,
      title: 'Design Patterns & Systems',
      description: 'Implement robust architectures, structures, and file interactions.',
      type: 'module',
      status: 'locked',
      ...getCoordinates(2),
      xpReward: 100,
      objectives: ['Design patterns concepts', 'Data models design', 'Error collection handles']
    },
    {
      id: `${careerGoal}-4`,
      title: 'Architectures Assessment',
      description: 'Audit compile parameters, data inputs, and system security rules.',
      type: 'assessment',
      status: 'locked',
      ...getCoordinates(3),
      xpReward: 150,
      objectives: ['Solve code test tasks', 'Explain execution bounds', 'Trace memory inputs']
    },
    {
      id: `${careerGoal}-5`,
      title: 'Advanced Operations',
      description: 'Optimize queries, scaling, concurrency, and thread bounds.',
      type: 'module',
      status: 'locked',
      ...getCoordinates(4),
      xpReward: 150,
      objectives: ['Performance evaluation', 'Query optimization procedures', 'Concurrently execute jobs']
    },
    {
      id: `${careerGoal}-6`,
      title: `${track.name} core Milestone`,
      description: `Verify critical parameters, logs, and deployment states for ${track.name}.`,
      type: 'milestone',
      status: 'locked',
      ...getCoordinates(5),
      xpReward: 200,
      objectives: ['Audit milestones rules', 'Confirm validation metrics', 'Unblock project tracks']
    },
    {
      id: `${careerGoal}-7`,
      title: `Capstone ${track.name} Project`,
      description: `Build an end-to-end production capstone application using ${langName}.`,
      type: 'project',
      status: 'locked',
      ...getCoordinates(6),
      xpReward: 300,
      objectives: ['Implement full logic systems', 'Integrate database and models', 'Write test suites procedures']
    },
    {
      id: `${careerGoal}-8`,
      title: 'Production Deploy & Scale',
      description: 'Deploy programs, monitor logs, and manage configuration environments.',
      type: 'module',
      status: 'locked',
      ...getCoordinates(7),
      xpReward: 100,
      objectives: ['Setup environment configs', 'Containerization structures', 'Monitor memory parameters']
    },
    {
      id: `${careerGoal}-9`,
      title: 'Technical Interview Whiteboard',
      description: `Explain algorithms, memory allocation, and system design for ${track.name}.`,
      type: 'interview',
      status: 'locked',
      ...getCoordinates(8),
      xpReward: 150,
      objectives: ['Solve code puzzles whiteboard', 'Explain system design decisions', 'Mock coding interviews tasks']
    },
    {
      id: `${careerGoal}-10`,
      title: `Certified ${track.name} Specialist`,
      description: `Obtain your digital badge and credential demonstrating expertise as a ${track.name}.`,
      type: 'certificate',
      status: 'locked',
      ...getCoordinates(9),
      xpReward: 250,
      objectives: ['Submit final compiled codes', 'Complete all roadmap steps', 'Claim verified credential']
    }
  ];
}

export function generateCareerRoadmap(
  careerGoal: string,
  language: string,
  experienceLevel: string,
  completedProblems: string[] = []
): CareerRoadmapNode[] {
  const nodes = generateRawCareerRoadmap(careerGoal, language, experienceLevel);

  // Post-process statuses dynamically based on completedProblems
  const resolvedNodes: CareerRoadmapNode[] = nodes.map((node) => {
    const isCompleted = completedProblems.includes(node.id) || 
                        completedProblems.includes(`${node.id}_${language}`) ||
                        completedProblems.includes(`${node.id}_${language.toLowerCase()}`);
    
    return {
      ...node,
      status: isCompleted ? 'completed' : 'locked'
    };
  });

  // Unlock sequential nodes
  if (resolvedNodes.length > 0 && resolvedNodes[0].status !== 'completed') {
    resolvedNodes[0].status = 'unlocked';
  }

  for (let i = 1; i < resolvedNodes.length; i++) {
    if (resolvedNodes[i].status !== 'completed' && resolvedNodes[i - 1].status === 'completed') {
      resolvedNodes[i].status = 'unlocked';
    }
  }

  return resolvedNodes;
}
