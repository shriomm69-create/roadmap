/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header, type ActiveTab } from './components/Header.tsx';
import { MapskillsCover } from './components/MapskillsCover.tsx';
import { MapskillsApp } from './components/MapskillsApp.tsx';
import { BTechRoadmapView } from './components/BTechRoadmapView.tsx';
import { QuizZoneView } from './components/QuizZoneView.tsx';
import { SkillGapView } from './components/SkillGapView.tsx';
import { ReadinessDashboardView } from './components/ReadinessDashboardView.tsx';
import { ProjectsAndResumeView } from './components/ProjectsAndResumeView.tsx';
import mapskillsDataRaw from './data/mapskillsData.json';
import type { QuizAttempt, StudentProfile } from './types/index.ts';
import {
  computePlacementReadiness,
  generateBTechCurriculum,
} from './utils/roadmapLogic.ts';

const MAPSKILLS_STORAGE_KEY = 'cs-roadmap-skills-v1';
const PROFILE_STORAGE_KEY = 'btech-placement-profile-v1';
const QUIZ_STORAGE_KEY = 'btech-quiz-history-v1';

const defaultProfile: StudentProfile = {
  name: 'B.Tech Engineer',
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
      id: 'proj-1',
      title: 'Collaborative Real-Time Code Canvas',
      path: 'sde',
      difficulty: 'Intermediate',
      githubUrl: 'https://github.com/example/code-canvas',
      status: 'In Progress',
      notes: 'Implemented CRDT sync for multi-user editing and sandboxed container runner.',
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mapskills');
  const [mapskillsSubView, setMapskillsSubView] = useState<'cover' | 'app'>('cover');
  const [selectedQuizCategory, setSelectedQuizCategory] = useState<string | undefined>(undefined);

  // MapSkills skills state
  const [savedSkills, setSavedSkills] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem(MAPSKILLS_STORAGE_KEY);
      if (stored) {
        const names: string[] = JSON.parse(stored);
        const map = new Map<string, number>(
          (mapskillsDataRaw.skills as [string, number][]).map((s, i) => [s[0], i])
        );
        const set = new Set<number>();
        names.forEach((n) => {
          if (map.has(n)) set.add(map.get(n)!);
        });
        return set;
      }
    } catch (e) {
      console.warn('Failed to parse saved skills from localStorage:', e);
    }
    return new Set<number>();
  });

  // Student Profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const local = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (local) return JSON.parse(local);
    } catch (e) {}
    return defaultProfile;
  });

  // Quiz attempts state
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
    try {
      const local = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (local) return JSON.parse(local);
    } catch (e) {}
    return [];
  });

  // Sync hash routing on initial load and hashchange
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#app') {
        setActiveTab('mapskills');
        setMapskillsSubView('app');
      } else if (window.location.hash === '#btech') {
        setActiveTab('btech-roadmap');
      } else if (window.location.hash === '#quiz') {
        setActiveTab('quiz-zone');
      } else if (window.location.hash === '#dashboard') {
        setActiveTab('readiness');
      } else if (!window.location.hash || window.location.hash === '#') {
        if (activeTab === 'mapskills') {
          setMapskillsSubView('cover');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [activeTab]);

  // Load from backend on mount if available
  useEffect(() => {
    fetch('/api/student-profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.year) {
          setStudentProfile((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    fetch('/api/quiz-attempts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setQuizHistory(data);
        }
      })
      .catch(() => {});
  }, []);

  // Save MapSkills skills to localStorage
  const saveMapskillsSkills = (newSet: Set<number>) => {
    setSavedSkills(newSet);
    try {
      const allSkills = mapskillsDataRaw.skills as [string, number][];
      const names = Array.from(newSet).map((id) => allSkills[id]?.[0] || '');
      localStorage.setItem(MAPSKILLS_STORAGE_KEY, JSON.stringify(names));
    } catch (e) {}
  };

  const handleToggleMapskill = (id: number) => {
    const next = new Set(savedSkills);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    saveMapskillsSkills(next);
  };

  const handleClearMapskills = () => {
    saveMapskillsSkills(new Set());
  };

  const handleAddMapskills = (ids: number[]) => {
    const next = new Set(savedSkills);
    ids.forEach((id) => next.add(id));
    saveMapskillsSkills(next);
  };

  const handleRemoveMapskills = (ids: number[]) => {
    const next = new Set(savedSkills);
    ids.forEach((id) => next.delete(id));
    saveMapskillsSkills(next);
  };

  // Update Student Profile
  const handleUpdateProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      // Sync with backend
      fetch('/api/student-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch(() => {});
      return next;
    });
  };

  // Toggle roadmap task
  const handleToggleRoadmapTask = (taskId: string, completed: boolean) => {
    const set = new Set(studentProfile.completedTasks);
    if (completed) {
      set.add(taskId);
    } else {
      set.delete(taskId);
    }
    handleUpdateProfile({ completedTasks: Array.from(set) });

    fetch('/api/roadmap-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, completed }),
    }).catch(() => {});
  };

  // Toggle checklist item
  const handleToggleChecklist = (key: string, value: boolean) => {
    const currentChecklist = { ...(studentProfile.resumeChecklist || {}) };
    currentChecklist[key] = value;
    handleUpdateProfile({ resumeChecklist: currentChecklist });
  };

  // Add new quiz attempt
  const handleQuizCompleted = (attempt: QuizAttempt) => {
    setQuizHistory((prev) => {
      const next = [attempt, ...prev];
      try {
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
      }).catch(() => {});
      return next;
    });
  };

  // Compute curriculum tasks based on current student profile
  const currentCurriculum = useMemo(() => {
    return generateBTechCurriculum(
      studentProfile.year,
      studentProfile.branch,
      studentProfile.targetPath
    );
  }, [studentProfile.year, studentProfile.branch, studentProfile.targetPath]);

  // Compute placement readiness metrics
  const readinessMetrics = useMemo(() => {
    return computePlacementReadiness(studentProfile, currentCurriculum, quizHistory, 8);
  }, [studentProfile, currentCurriculum, quizHistory]);

  return (
    <div className="min-h-screen bg-[#07050D] text-[#F1ECFF] flex flex-col font-['Sora'] selection:bg-[#7C3AED] selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'mapskills') {
            window.location.hash = mapskillsSubView === 'app' ? '#app' : '';
          } else {
            window.location.hash = `#${tab}`;
          }
        }}
        savedSkillsCount={savedSkills.size}
        profile={studentProfile}
        readinessPct={readinessMetrics.readinessPercentage}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* TAB 1: 1:1 MAPSKILLS REPLICATION */}
        {activeTab === 'mapskills' && (
          <>
            {mapskillsSubView === 'cover' ? (
              <MapskillsCover
                onEnterApp={() => {
                  setMapskillsSubView('app');
                  window.location.hash = '#app';
                  window.scrollTo(0, 0);
                }}
                onEnterBTech={() => {
                  setActiveTab('btech-roadmap');
                  window.location.hash = '#btech-roadmap';
                  window.scrollTo(0, 0);
                }}
                rolesCount={mapskillsDataRaw.roles.length}
                catsCount={mapskillsDataRaw.cats.length}
                skillsCount={
                  (mapskillsDataRaw.skills as [string, number][]).filter((s) => s[1] > 0).length
                }
              />
            ) : (
              <MapskillsApp
                onBackToOverview={() => {
                  setMapskillsSubView('cover');
                  window.location.hash = '';
                  window.scrollTo(0, 0);
                }}
                savedSkills={savedSkills}
                onToggleSkill={handleToggleMapskill}
                onClearSkills={handleClearMapskills}
                onAddSkills={handleAddMapskills}
                onRemoveSkills={handleRemoveMapskills}
              />
            )}
          </>
        )}

        {/* TAB 2: B.TECH PERSONALIZED ROADMAP */}
        {activeTab === 'btech-roadmap' && (
          <BTechRoadmapView
            profile={studentProfile}
            tasks={currentCurriculum}
            onUpdateProfile={handleUpdateProfile}
            onToggleTask={handleToggleRoadmapTask}
            onNavigateToQuiz={(cat) => {
              setSelectedQuizCategory(cat);
              setActiveTab('quiz-zone');
              window.location.hash = '#quiz-zone';
            }}
            onNavigateToProjects={() => {
              setActiveTab('projects');
              window.location.hash = '#projects';
            }}
          />
        )}

        {/* TAB 3: INTERACTIVE QUIZ ZONE */}
        {activeTab === 'quiz-zone' && (
          <QuizZoneView
            initialCategory={selectedQuizCategory}
            onQuizCompleted={handleQuizCompleted}
            quizHistory={quizHistory}
            onNavigateToSkillGap={() => {
              setActiveTab('skill-gap');
              window.location.hash = '#skill-gap';
            }}
          />
        )}

        {/* TAB 4: SKILL GAP ANALYSIS */}
        {activeTab === 'skill-gap' && (
          <SkillGapView
            profile={studentProfile}
            quizHistory={quizHistory}
            onTakeQuiz={(cat) => {
              setSelectedQuizCategory(cat);
              setActiveTab('quiz-zone');
              window.location.hash = '#quiz-zone';
            }}
            onJumpToRoadmap={() => {
              setActiveTab('btech-roadmap');
              window.location.hash = '#btech-roadmap';
            }}
          />
        )}

        {/* TAB 5: PLACEMENT READINESS DASHBOARD */}
        {activeTab === 'readiness' && (
          <ReadinessDashboardView
            profile={studentProfile}
            metrics={readinessMetrics}
            tasks={currentCurriculum}
            onToggleChecklist={handleToggleChecklist}
            onNavigateToRoadmap={() => {
              setActiveTab('btech-roadmap');
              window.location.hash = '#btech-roadmap';
            }}
            onNavigateToQuiz={() => {
              setActiveTab('quiz-zone');
              window.location.hash = '#quiz-zone';
            }}
            onNavigateToProjects={() => {
              setActiveTab('projects');
              window.location.hash = '#projects';
            }}
          />
        )}

        {/* TAB 6: PROJECTS AND RESUME PREPARATION */}
        {activeTab === 'projects' && (
          <ProjectsAndResumeView
            profile={studentProfile}
            onUpdateProjects={(projects) => handleUpdateProfile({ customProjects: projects })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#2B2052] py-8 text-center text-xs text-[#A096C8] bg-[#07050D]">
        <div className="max-w-[1180px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#F1ECFF]">Skillify</span>
            <span>· B.Tech Skill Learning & Placement Preparation</span>
          </div>
          <div className="text-[11px] text-[#A096C8]">
            Guidance & progress tracking engine. Real local & backend persistence.
          </div>
        </div>
      </footer>
    </div>
  );
}
