import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent JSON storage directory
const DATA_DIR = path.join(__dirname, '.data');
const STORE_FILE = path.join(DATA_DIR, 'student_store.json');

interface StoreData {
  profile: {
    name: string;
    year: string;
    branch: string;
    targetPath: string;
    targetRole: string;
    completedTasks: string[];
    bookmarkedQuizzes: string[];
    resumeChecklist: Record<string, boolean>;
    customProjects: Array<{
      id: string;
      title: string;
      path: string;
      difficulty: string;
      githubUrl?: string;
      liveUrl?: string;
      status: 'Planned' | 'In Progress' | 'Completed';
      notes?: string;
    }>;
  };
  quizAttempts: Array<{
    id: string;
    timestamp: string;
    category: string;
    difficulty: string;
    score: number;
    total: number;
    accuracy: number;
    timeSpentSeconds: number;
    topicBreakdown: Record<string, { correct: number; total: number }>;
    userAnswers: Array<{ questionId: string; selectedIndex: number; correctIndex: number; isCorrect: boolean }>;
  }>;
}

const defaultStore: StoreData = {
  profile: {
    name: 'B.Tech Scholar',
    year: '3rd',
    branch: 'CSE',
    targetPath: 'sde',
    targetRole: 'Software Development Engineer',
    completedTasks: ['w1', 'w2'],
    bookmarkedQuizzes: [],
    resumeChecklist: {
      atsFormat: true,
      githubLinks: true,
      leetcode50: false,
      projectsDeployed: false,
      csCoreRevision: false,
      mockInterview: false,
      starStories: false,
      linkedinUpdated: true,
    },
    customProjects: [
      {
        id: 'proj-init',
        title: 'Collaborative Real-Time Code Canvas',
        path: 'sde',
        difficulty: 'Intermediate',
        status: 'In Progress',
        notes: 'Building CRDT sync and Docker container execution runner.',
      },
    ],
  },
  quizAttempts: [
    {
      id: 'init-att-1',
      timestamp: new Date().toISOString(),
      category: 'Data Structures and Algorithms',
      difficulty: 'Medium',
      score: 4,
      total: 5,
      accuracy: 80,
      timeSpentSeconds: 154,
      topicBreakdown: {
        'Array Searching': { correct: 1, total: 1 },
        'Linked Lists': { correct: 1, total: 1 },
        'Trees & BST': { correct: 1, total: 1 },
        'Graph Algorithms': { correct: 0, total: 1 },
        'Dynamic Programming': { correct: 1, total: 1 },
      },
      userAnswers: [],
    },
  ],
};

function readStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(defaultStore, null, 2), 'utf-8');
      return defaultStore;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading storage, returning defaults:', err);
    return defaultStore;
  }
}

function writeStore(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing storage:', err);
  }
}

// ------------------- API Routes -------------------

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/student-profile', (_req, res) => {
  const store = readStore();
  res.json(store.profile);
});

app.post('/api/student-profile', (req, res) => {
  const store = readStore();
  const updated = { ...store.profile, ...req.body };
  store.profile = updated;
  writeStore(store);
  res.json({ success: true, profile: store.profile });
});

app.get('/api/quiz-attempts', (_req, res) => {
  const store = readStore();
  res.json(store.quizAttempts || []);
});

app.post('/api/quiz-attempts', (req, res) => {
  const store = readStore();
  const attempt = req.body;
  if (!attempt || !attempt.id) {
    return res.status(400).json({ error: 'Invalid quiz attempt' });
  }
  store.quizAttempts = [attempt, ...(store.quizAttempts || [])];
  writeStore(store);
  res.json({ success: true, count: store.quizAttempts.length });
});

app.post('/api/roadmap-progress', (req, res) => {
  const store = readStore();
  const { taskId, completed } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'taskId is required' });
  }
  const set = new Set(store.profile.completedTasks || []);
  if (completed) {
    set.add(taskId);
  } else {
    set.delete(taskId);
  }
  store.profile.completedTasks = Array.from(set);
  writeStore(store);
  res.json({ success: true, completedTasks: store.profile.completedTasks });
});

// ------------------- Vite Middleware / Static Serve -------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
