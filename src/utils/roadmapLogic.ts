import type {
  BTechBranch,
  BTechYear,
  CareerPath,
  PlacementReadinessMetrics,
  QuizAttempt,
  RoadmapTask,
  SkillGapItem,
  StudentProfile,
} from '../types/index.ts';

// ----------------- MapSkills Scoring Engine -----------------

export function calculateIdf(skillId: number, totalRoles: number, skillFreq: number): number {
  return Math.log(1 + totalRoles / Math.max(1, skillFreq));
}

export function isItemKnown(
  item: number | number[],
  knownSkills: Set<number>,
  aliasMap: Record<string, number[]>
): boolean {
  const checkOne = (k: number) => {
    if (knownSkills.has(k)) return true;
    const aliases = aliasMap[k];
    if (aliases && aliases.some((a) => knownSkills.has(a))) return true;
    return false;
  };

  if (Array.isArray(item)) {
    return item.some(checkOne);
  }
  return checkOne(item);
}

export function getItemWeight(
  item: number | number[],
  totalRoles: number,
  skillsList: [string, number][]
): number {
  if (Array.isArray(item)) {
    if (item.length === 0) return 0;
    const sum = item.reduce((acc, k) => {
      const freq = skillsList[k] ? skillsList[k][1] : 1;
      return acc + calculateIdf(k, totalRoles, freq);
    }, 0);
    return sum / item.length;
  }
  const freq = skillsList[item] ? skillsList[item][1] : 1;
  return calculateIdf(item, totalRoles, freq);
}

export function calculateRoleScore(
  role: { g: [string, number, (number | number[])[]][] },
  knownSkills: Set<number>,
  totalRoles: number,
  skillsList: [string, number][],
  aliasMap: Record<string, number[]>,
  floorWeight = 10
): { p: number; have: number; tot: number } {
  let num = 0;
  let den = 0;
  let have = 0;
  let tot = 0;

  for (const group of role.g) {
    const isAdv = group[1] === 1;
    const mult = isAdv ? 0.5 : 1.0;
    for (const item of group[2]) {
      const w = getItemWeight(item, totalRoles, skillsList) * mult;
      den += w;
      tot++;
      if (isItemKnown(item, knownSkills, aliasMap)) {
        num += w;
        have++;
      }
    }
  }

  const p = num / Math.max(den, floorWeight);
  return { p: Math.min(1, p), have, tot };
}

export function getFitTier(p: number): string {
  if (p >= 0.45) return 'Strong fit';
  if (p >= 0.25) return 'Solid fit';
  if (p >= 0.1) return 'Building';
  return 'Early';
}

// ----------------- B.Tech Roadmap Generator -----------------

export function generateBTechCurriculum(
  year: BTechYear,
  branch: BTechBranch,
  path: CareerPath
): RoadmapTask[] {
  const tasks: RoadmapTask[] = [];

  // Phase 1: Core Foundation (Adjusted for Year & Branch)
  const isEarly = year === '1st' || year === '2nd';
  const isCircuital = branch === 'ECE' || branch === 'EE';
  const isNonCs = branch === 'ME' || branch === 'CE';

  // Week 1-4: Programming Foundations
  tasks.push({
    id: 'w1',
    phaseId: 1,
    phaseTitle: 'Phase 1: Foundations & Problem Solving',
    week: 1,
    category: 'Programming Fundamentals',
    title: isEarly ? 'Mastering Memory, Pointers & Clean Syntax' : 'Language Fluency & High-Speed Idiomatic Coding',
    description: `Deep dive into ${path === 'aiml' || path === 'data_analytics' ? 'Python & vectorized arrays' : 'C/C++ or Java memory model, pointers, references, and standard I/O'}. Master recursion mechanics, memory allocation, and time complexity foundations.`,
    keyTopics: ['Time & Space Complexity Big-O', 'Pointers / References & Stack vs Heap', 'Bit Manipulation Basics', 'Recursion Trees & Call Stacks'],
    practiceExercises: [
      { title: 'Implement dynamic array / vector from scratch', type: 'code' },
      { title: 'Complete Bit Manipulation Quiz (15 MCQs)', type: 'quiz' },
      { title: 'Solve 10 Easy Recursion & Array challenges', type: 'code' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w2',
    phaseId: 1,
    phaseTitle: 'Phase 1: Foundations & Problem Solving',
    week: 2,
    category: 'Linear Data Structures',
    title: 'Linear DSA Mastery (Arrays, Linked Lists, Fast & Slow Pointers)',
    description: 'Construct singly/doubly linked lists, cycle detection via Floyd’s Tortoise & Hare, reverse lists in-place, and solve two-pointer array partitions.',
    keyTopics: ['In-place Array Manipulations', 'Two Pointers & Sliding Window Pattern', 'Fast & Slow Pointers in Linked Lists', 'LRU Cache Design Strategy'],
    practiceExercises: [
      { title: 'Reverse a Linked List in Groups of K', type: 'code' },
      { title: 'Sliding Window Maximum & Min Subarray', type: 'code' },
      { title: 'Take Linear Data Structures Quiz', type: 'quiz' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w3',
    phaseId: 1,
    phaseTitle: 'Phase 1: Foundations & Problem Solving',
    week: 3,
    category: 'Stacks & Queues',
    title: 'Monotonic Stacks, Queues & Priority Queues',
    description: 'Understand next greater element problems, min stacks in O(1), circular queues, and binary heap operations for top-K elements.',
    keyTopics: ['Monotonic Stack Technique', 'Circular Queue & Deque', 'Binary Min/Max Heap Heapify', 'Top K Frequent Elements'],
    practiceExercises: [
      { title: 'Largest Rectangle in Histogram (Hard)', type: 'code' },
      { title: 'Design Twitter Feed / Top K Stream', type: 'code' },
      { title: 'Practice Stack & Heap Quiz', type: 'quiz' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w4',
    phaseId: 1,
    phaseTitle: 'Phase 1: Foundations & Problem Solving',
    week: 4,
    category: 'Aptitude & Logical Reasoning',
    title: 'Quantitative Aptitude, Speed Drills & Logical Puzzles',
    description: 'Placement aptitude elimination round preparation. Master percentages, ratios, time-speed-distance, permutations, probability, and syllogisms.',
    keyTopics: ['Time, Speed & Work Equivalence', 'Probability & Bayes Concept', 'Coding-Decoding & Blood Relations', 'Data Interpretation Tables'],
    practiceExercises: [
      { title: 'Solve 25 Quantitative Aptitude MCQs', type: 'quiz' },
      { title: 'Solve 15 Logical Deduction & Syllogism Puzzles', type: 'quiz' },
      { title: 'Speed Math shortcut techniques revision', type: 'reading' },
    ],
    completed: false,
  });

  // Phase 2: Core DSA & Algorithms (Weeks 5-8)
  tasks.push({
    id: 'w5',
    phaseId: 2,
    phaseTitle: 'Phase 2: Advanced Algorithms & Data Structures',
    week: 5,
    category: 'Trees & Binary Search Trees',
    title: 'Binary Trees, BSTs, Traversals & LCA',
    description: 'Master recursive and iterative DFS (pre, in, post order), BFS level-order, lowest common ancestor, diameter, and serialization/deserialization.',
    keyTopics: ['Tree Traversals & Boundary Traversals', 'Lowest Common Ancestor (LCA)', 'BST Validation & Inorder Successor', 'Serialize & Deserialize Binary Tree'],
    practiceExercises: [
      { title: 'Binary Tree Maximum Path Sum', type: 'code' },
      { title: 'Validate Binary Search Tree in O(N)', type: 'code' },
      { title: 'Take Tree & Graph Diagnostic Quiz', type: 'quiz' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w6',
    phaseId: 2,
    phaseTitle: 'Phase 2: Advanced Algorithms & Data Structures',
    week: 6,
    category: 'Graph Algorithms',
    title: 'Graph Theory, BFS/DFS, Shortest Paths & DSU',
    description: 'Build adjacency lists, cycle detection in directed/undirected graphs, Topological Sort (Kahn’s algorithm), Dijkstra, Bellman-Ford, and Disjoint Set Union.',
    keyTopics: ['BFS / DFS on Grids & Adjacency Lists', 'Topological Sort & Course Scheduling', 'Dijkstra Single-Source Shortest Path', 'Disjoint Set Union (DSU) with Path Compression'],
    practiceExercises: [
      { title: 'Number of Islands & Rotting Oranges', type: 'code' },
      { title: 'Network Delay Time (Dijkstra)', type: 'code' },
      { title: 'Kruskal Minimum Spanning Tree with DSU', type: 'code' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w7',
    phaseId: 2,
    phaseTitle: 'Phase 2: Advanced Algorithms & Data Structures',
    week: 7,
    category: 'Dynamic Programming',
    title: 'Dynamic Programming: 1D, 2D, Knapsack & Subsequences',
    description: 'Overcome fear of DP by building recurrence relations from memoization to tabulation and space optimization. Master 0/1 Knapsack, Unbounded Knapsack, and LCS.',
    keyTopics: ['Recurrence State Formulation', '0/1 Knapsack & Subset Sum Equivalence', 'Longest Common Subsequence (LCS) & Edit Distance', 'Matrix Chain Multiplication & Partition DP'],
    practiceExercises: [
      { title: 'Coin Change I & II Tabulation', type: 'code' },
      { title: 'Longest Increasing Subsequence (O(N log N))', type: 'code' },
      { title: 'Solve 10 Medium DP interview problems', type: 'code' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w8',
    phaseId: 2,
    phaseTitle: 'Phase 2: Advanced Algorithms & Data Structures',
    week: 8,
    category: 'Interview Coding Sprints',
    title: 'LeetCode 75 Pattern Revision & Timed Coding Mock',
    description: 'Simulate on-campus online assessments (HackerEarth / HackerRank / Mettl) with strict 60-minute time limits and hidden test cases.',
    keyTopics: ['Edge Case Identification', 'Boundary Value Analysis', 'Handling Large Integers (Modulo Arithmetic)', 'Time Management during Online Tests'],
    practiceExercises: [
      { title: 'Attempt 90-min Full Mock Assessment', type: 'quiz' },
      { title: 'Review 5 Most Common OA String / Array traps', type: 'reading' },
    ],
    completed: false,
  });

  // Phase 3: Core CS Engineering Subjects (Weeks 9-12)
  tasks.push({
    id: 'w9',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core CS Subjects & System Architecture',
    week: 9,
    category: 'Operating Systems',
    title: 'Operating Systems: Process Scheduling, Threads, Deadlocks & Paging',
    description: 'Crucial for technical interviews across all product and service companies. Deep dive into context switching, race conditions, semaphores, mutexes, Banker’s algorithm, and virtual memory page replacement.',
    keyTopics: ['Process vs Thread Memory Layout', 'Inter-Process Communication (Pipes, Sockets, Shared Memory)', 'Deadlock 4 Conditions & Banker Algorithm', 'Virtual Memory, TLB, Page Fault Handling & LRU'],
    practiceExercises: [
      { title: 'Operating Systems 20-Question Drill', type: 'quiz' },
      { title: 'Implement Producer-Consumer using Mutex/Semaphores', type: 'code' },
      { title: 'Study Linux Kernel Memory Architecture', type: 'reading' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w10',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core CS Subjects & System Architecture',
    week: 10,
    category: 'DBMS & SQL',
    title: 'Database Management Systems, Normalization, Indexing & Transactions',
    description: 'Write complex SQL joins, aggregations, window functions. Understand ACID properties, isolation levels (Dirty Read, Non-repeatable Read, Phantom Read), B+ Tree indexing, and NoSQL vs SQL tradeoffs.',
    keyTopics: ['SQL Joins, Subqueries & CTEs', 'Database Normalization (1NF to BCNF)', 'ACID Transactions & Two-Phase Locking', 'B+ Tree Indexing & Query Explain Plans'],
    practiceExercises: [
      { title: 'Solve 15 Complex SQL Interview Queries', type: 'code' },
      { title: 'DBMS Fundamentals & ACID Quiz', type: 'quiz' },
      { title: 'Compare PostgreSQL vs MongoDB for high-write loads', type: 'reading' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w11',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core CS Subjects & System Architecture',
    week: 11,
    category: 'Computer Networks',
    title: 'Computer Networks: OSI/TCP Model, TCP Handshake, DNS & HTTP/3',
    description: 'Understand what happens under the hood when you enter a URL in a browser. Master TCP 3-way handshake, SYN floods, flow control vs congestion control, UDP, DNS resolution, and TLS certificates.',
    keyTopics: ['OSI 7 Layers vs TCP/IP 4 Layers', 'TCP 3-Way Handshake & Connection Teardown', 'IP Subnetting (CIDR) & NAT', 'DNS Resolution & HTTPS/TLS Handshake'],
    practiceExercises: [
      { title: 'Computer Networks Full Topic Quiz', type: 'quiz' },
      { title: 'Inspect Packet Capture in Wireshark', type: 'project' },
      { title: 'Write a basic TCP Echo Server in C/Python/Node', type: 'code' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w12',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core CS Subjects & System Architecture',
    week: 12,
    category: 'Object-Oriented Design',
    title: 'OOP Design, SOLID Principles & Low-Level Design (LLD)',
    description: 'Learn how to model real-world systems in code without tight coupling. Implement SOLID principles, Factory, Singleton, Observer, and Strategy design patterns with clean UML diagrams.',
    keyTopics: ['Encapsulation, Inheritance, Polymorphism & Abstraction', 'SOLID Design Principles with Clean Code Examples', 'Design Patterns: Factory, Singleton, Strategy, Observer', 'LLD Exercise: Parking Lot / Elevator System'],
    practiceExercises: [
      { title: 'Take OOP & Design Patterns Quiz', type: 'quiz' },
      { title: 'Design Parking Lot System with OOP hierarchy', type: 'code' },
      { title: 'Refactor code snippet violating Open-Closed Principle', type: 'code' },
    ],
    completed: false,
  });

  // Phase 4: Path-Specific Specialization & Capstone Project (Weeks 13-16)
  if (path === 'sde') {
    tasks.push({
      id: 'w13',
      phaseId: 4,
      phaseTitle: 'Phase 4: SDE Specialization & Capstone Project',
      week: 13,
      category: 'Software Engineering',
      title: 'Full-Stack Architecture & RESTful Microservices',
      description: 'Build robust REST and GraphQL APIs with input validation, JWT authentication, rate limiting, and database connection pooling.',
      keyTopics: ['Stateless API Design & HTTP Status Codes', 'JWT Tokens & Refresh Token Rotation', 'Redis In-Memory Caching & Cache-Aside Pattern', 'Database Migrations & ORM Best Practices'],
      practiceExercises: [
        { title: 'Build Authenticated REST API with Rate Limiting', type: 'project' },
        { title: 'Configure Redis Caching for Hot Endpoints', type: 'code' },
      ],
      completed: false,
    });
    tasks.push({
      id: 'w14',
      phaseId: 4,
      phaseTitle: 'Phase 4: SDE Specialization & Capstone Project',
      week: 14,
      category: 'Software Engineering',
      title: 'High-Level System Design (HLD) Foundations',
      description: 'Learn how to scale from 100 to 1,000,000 users. Master horizontal scaling, load balancers (Nginx/HAProxy), CDN caching, message queues (Kafka/RabbitMQ), and sharding.',
      keyTopics: ['Load Balancing Algorithms (Round Robin, Least Connection)', 'Database Sharding & Consistent Hashing', 'Message Queues for Asynchronous Decoupling', 'Design URL Shortener (TinyURL) & WhatsApp Chat'],
      practiceExercises: [
        { title: 'Design TinyURL Architecture Diagram', type: 'project' },
        { title: 'High-Level System Design Interview Quiz', type: 'quiz' },
      ],
      completed: false,
    });
  } else if (path === 'aiml') {
    tasks.push({
      id: 'w13',
      phaseId: 4,
      phaseTitle: 'Phase 4: AI/ML Specialization & Pipeline Project',
      week: 13,
      category: 'AI & Machine Learning',
      title: 'Supervised/Unsupervised Modeling & PyTorch Deep Learning',
      description: 'Implement regression, classification, random forests, XGBoost, and neural networks in PyTorch with loss functions, backprop, and validation metrics.',
      keyTopics: ['Gradient Descent, Learning Rates & Optimizers', 'CNN Architectures for Computer Vision', 'Transformer Attention Mechanism Foundations', 'Hyperparameter Tuning & Cross-Validation'],
      practiceExercises: [
        { title: 'Train PyTorch CNN Classifier with 95%+ Accuracy', type: 'project' },
        { title: 'Take Machine Learning Fundamentals Quiz', type: 'quiz' },
      ],
      completed: false,
    });
    tasks.push({
      id: 'w14',
      phaseId: 4,
      phaseTitle: 'Phase 4: AI/ML Specialization & Pipeline Project',
      week: 14,
      category: 'AI & Machine Learning',
      title: 'RAG Systems, Vector Databases & LLM Inference',
      description: 'Build a production Retrieval-Augmented Generation (RAG) assistant using vector embeddings, hybrid search, document chunking, and prompt engineering.',
      keyTopics: ['Vector Embeddings & Cosine Similarity', 'Vector Stores (Qdrant, Pinecone, Chroma)', 'RAG Pipeline Evaluation & Grounding', 'Model Quantization (INT8/4-bit) & Local Serving'],
      practiceExercises: [
        { title: 'Deploy a Document Question-Answering RAG Agent', type: 'project' },
        { title: 'LLM & AI Systems Assessment Quiz', type: 'quiz' },
      ],
      completed: false,
    });
  } else if (path === 'cybersecurity') {
    tasks.push({
      id: 'w13',
      phaseId: 4,
      phaseTitle: 'Phase 4: Cybersecurity & Security Engineering',
      week: 13,
      category: 'Cybersecurity',
      title: 'Web Application Security & OWASP Top 10 Exploits',
      description: 'Hands-on defense against SQL Injection, XSS, CSRF, SSRF, IDOR, and Broken Authentication. Learn secure coding and defense-in-depth.',
      keyTopics: ['SQL Injection Remediation with Parameterized Queries', 'Cross-Site Scripting (XSS) Prevention & CSP', 'IDOR & Broken Access Controls', 'Burp Suite Traffic Interception & Fuzzing'],
      practiceExercises: [
        { title: 'Complete Web Security Vulnerability Labs', type: 'project' },
        { title: 'Take OWASP & Network Security Quiz', type: 'quiz' },
      ],
      completed: false,
    });
    tasks.push({
      id: 'w14',
      phaseId: 4,
      phaseTitle: 'Phase 4: Cybersecurity & Security Engineering',
      week: 14,
      category: 'Cybersecurity',
      title: 'Network Forensics, Cryptography & Threat Detection',
      description: 'Understand public-key cryptography (RSA, ECC), digital certificates, AES encryption, SIEM log monitoring, and malware analysis fundamentals.',
      keyTopics: ['Symmetric vs Asymmetric Cryptography', 'PKI & TLS Certificate Authority Verification', 'SIEM Rule Writing & Alert Triage', 'Linux Endpoint Forensics & Memory Analysis'],
      practiceExercises: [
        { title: 'Analyze PCAP capture for suspicious exfiltration', type: 'project' },
        { title: 'Take Cryptography & Forensics Assessment', type: 'quiz' },
      ],
      completed: false,
    });
  } else {
    tasks.push({
      id: 'w13',
      phaseId: 4,
      phaseTitle: 'Phase 4: Engineering Specialization & Systems',
      week: 13,
      category: 'Systems & Core Engineering',
      title: isCircuital ? 'Microcontroller Firmware, RTOS & Embedded Buses' : 'Data Pipelines, ETL & Analytical Modeling',
      description: isCircuital
        ? 'Program ARM Cortex microcontrollers with FreeRTOS, GPIO interrupts, I2C/SPI sensor drivers, and DMA communication.'
        : 'Build automated ETL data ingestion pipelines with relational data warehousing, Star Schemas, and analytical reporting.',
      keyTopics: isCircuital
        ? ['FreeRTOS Tasks, Queues & Semaphores', 'I2C, SPI & UART Protocol Timings', 'Interrupt Latency & Critical Sections', 'Hardware Watchdogs & Power Modes']
        : ['Dimensional Modeling: Fact & Dimension Tables', 'dbt Data Transformations', 'Stream Processing with Kafka', 'Analytical Dashboards'],
      practiceExercises: [
        { title: 'Build Hardware Sensor Logger / Data Pipeline MVP', type: 'project' },
        { title: 'Engineering Systems Mastery Quiz', type: 'quiz' },
      ],
      completed: false,
    });
    tasks.push({
      id: 'w14',
      phaseId: 4,
      phaseTitle: 'Phase 4: Engineering Specialization & Systems',
      week: 14,
      category: 'Systems & Cloud Infrastructure',
      title: 'Docker Containerization & CI/CD Deployment Automation',
      description: 'Package your project into multi-stage Docker containers, write Docker Compose manifests, and set up automated GitHub Actions CI/CD tests.',
      keyTopics: ['Multi-Stage Dockerfiles & Alpine Base Images', 'Container Networking & Volume Mounting', 'GitHub Actions CI Testing & Linting Workflows', 'Cloud Deployment to Cloud Run or Render'],
      practiceExercises: [
        { title: 'Containerize and Deploy Full Capstone Project', type: 'project' },
        { title: 'Docker & CI/CD Infrastructure Quiz', type: 'quiz' },
      ],
      completed: false,
    });
  }

  // Phase 5: Resume, GitHub Portfolio & Interview Preparation (Weeks 15-18)
  tasks.push({
    id: 'w15',
    phaseId: 5,
    phaseTitle: 'Phase 5: Resume, Portfolio & Placement Readiness',
    week: 15,
    category: 'Resume & Portfolio',
    title: 'ATS-Proof Resume Crafting & GitHub Showcase Polish',
    description: 'Transform project descriptions into quantifiable impact bullets following the Google XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]". Polish GitHub READMEs with architecture diagrams and live demo links.',
    keyTopics: ['Single-page ATS Standard Formatting (Jake\'s / Deedy Template)', 'Quantifying Performance Gains (Latency, Throughput, Accuracy)', 'GitHub Portfolio: Pinning 3 Outstanding Repos', 'LinkedIn Profile Optimization for Tech Recruiters'],
    practiceExercises: [
      { title: 'Audit Resume using ATS Checklist', type: 'reading' },
      { title: 'Write Comprehensive README for Major Project', type: 'project' },
    ],
    completed: false,
  });

  tasks.push({
    id: 'w16',
    phaseId: 5,
    phaseTitle: 'Phase 5: Resume, Portfolio & Placement Readiness',
    week: 16,
    category: 'Interview Preparation',
    title: 'Mock Technical Rounds & Behavioral STAR Mastery',
    description: 'Practice articulating technical trade-offs while writing clean code on whiteboard or shared screen. Master HR & Behavioral questions using the STAR method (Situation, Task, Action, Result).',
    keyTopics: ['Live Coding Communication & Thinking Aloud', 'Handling Incomplete Problem Statements & Clarifying Edge Cases', 'STAR Method for Leadership, Conflict & Failure Stories', 'Company-Specific Research & Asking Smart Interviewer Questions'],
    practiceExercises: [
      { title: 'Conduct Peer / AI Technical Mock Interview', type: 'quiz' },
      { title: 'Draft 5 Key Behavioral STAR Stories', type: 'reading' },
      { title: 'Complete Placement Readiness Final Exam', type: 'quiz' },
    ],
    completed: false,
  });

  return tasks;
}

// ----------------- Skill Gap Analysis Engine -----------------

export function computeSkillGapAnalysis(
  attempts: QuizAttempt[],
  completedTaskIds: string[]
): SkillGapItem[] {
  const categoryStats: Record<string, { correct: number; total: number; attempts: number }> = {};

  // Aggregate quiz attempts
  for (const att of attempts) {
    if (!categoryStats[att.category]) {
      categoryStats[att.category] = { correct: 0, total: 0, attempts: 0 };
    }
    categoryStats[att.category].correct += att.score;
    categoryStats[att.category].total += att.total;
    categoryStats[att.category].attempts += 1;
  }

  // Define default core curriculum areas if no attempts yet
  const defaultCategories = [
    { cat: 'Data Structures and Algorithms', topic: 'DSA & Complexity', quiz: 'Data Structures and Algorithms' },
    { cat: 'Operating Systems', topic: 'Process & Memory Management', quiz: 'Operating Systems' },
    { cat: 'DBMS', topic: 'SQL & Database Normalization', quiz: 'DBMS' },
    { cat: 'Computer Networks', topic: 'TCP/IP & OSI Protocols', quiz: 'Computer Networks' },
    { cat: 'Object-Oriented Programming', topic: 'OOP & SOLID Principles', quiz: 'Object-Oriented Programming' },
    { cat: 'Quantitative Aptitude and Logical Reasoning', topic: 'Speed Math & Aptitude', quiz: 'Quantitative Aptitude and Logical Reasoning' },
  ];

  const gaps: SkillGapItem[] = [];

  for (const item of defaultCategories) {
    const stats = categoryStats[item.cat];
    let accuracyPct = 0;
    let totalAttempts = 0;

    if (stats && stats.total > 0) {
      accuracyPct = Math.round((stats.correct / stats.total) * 100);
      totalAttempts = stats.attempts;
    } else {
      // Check if related roadmap task is completed
      const hasCompletedRelatedTask = completedTaskIds.length > 0;
      accuracyPct = hasCompletedRelatedTask ? 40 : 0;
    }

    let status: 'Needs Practice' | 'Developing' | 'Solid' = 'Needs Practice';
    let recommendation = '';
    let actionTask = '';

    if (accuracyPct >= 75) {
      status = 'Solid';
      recommendation = `Strong command verified across ${totalAttempts} assessments. Maintain retention with periodic timed drills.`;
      actionTask = 'Try Hard-level challenge quizzes';
    } else if (accuracyPct >= 50) {
      status = 'Developing';
      recommendation = `Good baseline understanding, but mistakes occur in intermediate edge cases and problem variations.`;
      actionTask = 'Review missed questions & practice 10 medium questions';
    } else {
      status = 'Needs Practice';
      recommendation = totalAttempts === 0
        ? `No quiz data recorded yet. Take the diagnostic quiz to benchmark current placement readiness.`
        : `Identified significant knowledge gaps (<50% accuracy). Prioritize revising the core theory notes.`;
      actionTask = 'Complete targeted category revision & retake quiz';
    }

    gaps.push({
      topic: item.topic,
      category: item.cat,
      accuracyPct,
      totalAttempts,
      status,
      recommendation,
      actionTask,
      quizCategory: item.quiz,
    });
  }

  // Sort: Needs Practice first, then Developing, then Solid
  const priorityOrder = { 'Needs Practice': 0, Developing: 1, Solid: 2 };
  gaps.sort((a, b) => priorityOrder[a.status] - priorityOrder[b.status] || a.accuracyPct - b.accuracyPct);

  return gaps;
}

// ----------------- Placement Readiness Calculator -----------------

export function computePlacementReadiness(
  profile: StudentProfile,
  allTasks: RoadmapTask[],
  attempts: QuizAttempt[],
  checklistTotal = 8
): PlacementReadinessMetrics {
  const totalTasks = allTasks.length || 16;
  const completedTasksCount = profile.completedTasks.length;
  const roadmapPct = Math.min(100, Math.round((completedTasksCount / totalTasks) * 100));

  let totalQuestions = 0;
  let correctQuestions = 0;
  for (const att of attempts) {
    totalQuestions += att.total;
    correctQuestions += att.score;
  }

  const quizAccuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  // Calculate resume checklist progress
  const checklistKeys = Object.keys(profile.resumeChecklist || {});
  const completedChecklistCount = checklistKeys.filter((k) => profile.resumeChecklist[k]).length;

  const projectsCompletedCount = (profile.customProjects || []).filter(
    (p) => p.status === 'Completed'
  ).length;

  // Weighted Readiness Score (strictly explained as a progress indicator, not guaranteed job)
  // Roadmap: 35%, Quizzes: 30%, Projects: 20%, Resume & Interview Checklist: 15%
  const projectScore = Math.min(100, projectsCompletedCount * 35); // 3 projects ~ 100%
  const checklistScore = Math.min(100, Math.round((completedChecklistCount / checklistTotal) * 100));

  const weightedScore = Math.round(
    roadmapPct * 0.35 +
    (totalQuestions > 0 ? quizAccuracy * 0.3 : (completedTasksCount > 2 ? 20 : 0)) +
    projectScore * 0.2 +
    checklistScore * 0.15
  );

  // Practiced vs needing revision
  const gapItems = computeSkillGapAnalysis(attempts, profile.completedTasks);
  const skillsPracticedCount = gapItems.filter((g) => g.status === 'Solid' || g.status === 'Developing').length;
  const skillsNeedingRevisionCount = gapItems.filter((g) => g.status === 'Needs Practice').length;

  return {
    readinessPercentage: Math.min(100, Math.max(0, weightedScore)),
    roadmapProgress: roadmapPct,
    quizAccuracy,
    tasksCompletedCount: completedTasksCount,
    tasksTotalCount: totalTasks,
    quizzesAttemptedCount: attempts.length,
    projectsCompletedCount,
    resumeChecklistCompletedCount: completedChecklistCount,
    resumeChecklistTotalCount: checklistTotal,
    skillsPracticedCount,
    skillsNeedingRevisionCount,
  };
}
