export type BTechYear = '1st' | '2nd' | '3rd' | '4th';

export type BTechBranch =
  | 'CSE'
  | 'IT'
  | 'ECE'
  | 'EE'
  | 'ME'
  | 'CE'
  | 'AI_DS';

export type CareerPath =
  | 'sde'
  | 'data_analytics'
  | 'aiml'
  | 'cybersecurity'
  | 'core_embedded'
  | 'cloud_devops';

export interface RoadmapTask {
  id: string;
  phaseId: number;
  phaseTitle: string;
  week: number;
  title: string;
  category: string;
  description: string;
  keyTopics: string[];
  practiceExercises: { title: string; type: 'code' | 'quiz' | 'project' | 'reading'; url?: string }[];
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
  topicTag: string;
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  category: string;
  difficulty: string;
  score: number;
  total: number;
  accuracy: number;
  timeSpentSeconds: number;
  topicBreakdown: Record<string, { correct: number; total: number }>;
  userAnswers: { questionId: string; selectedIndex: number; correctIndex: number; isCorrect: boolean }[];
}

export interface StudentProfile {
  name: string;
  year: BTechYear;
  branch: BTechBranch;
  targetPath: CareerPath;
  targetRole: string;
  completedTasks: string[];
  bookmarkedQuizzes: string[];
  resumeChecklist: Record<string, boolean>;
  customProjects: {
    id: string;
    title: string;
    path: string;
    difficulty: string;
    githubUrl?: string;
    liveUrl?: string;
    status: 'Planned' | 'In Progress' | 'Completed';
    notes?: string;
  }[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  careerPath: CareerPath;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  techStack: string[];
  keyFeatures: string[];
  interviewDiscussionPoints: string[];
  atsResumeBullet: string;
}

export interface SkillGapItem {
  topic: string;
  category: string;
  accuracyPct: number;
  totalAttempts: number;
  status: 'Needs Practice' | 'Developing' | 'Solid';
  recommendation: string;
  actionTask: string;
  quizCategory: string;
}

export interface PlacementReadinessMetrics {
  readinessPercentage: number;
  roadmapProgress: number; // 0-100
  quizAccuracy: number; // 0-100
  tasksCompletedCount: number;
  tasksTotalCount: number;
  quizzesAttemptedCount: number;
  projectsCompletedCount: number;
  resumeChecklistCompletedCount: number;
  resumeChecklistTotalCount: number;
  skillsPracticedCount: number;
  skillsNeedingRevisionCount: number;
}
