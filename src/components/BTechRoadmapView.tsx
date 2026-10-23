import React, { useState } from 'react';
import type {
  BTechBranch,
  BTechYear,
  CareerPath,
  RoadmapTask,
  StudentProfile,
} from '../types/index.ts';

interface BTechRoadmapViewProps {
  profile: StudentProfile;
  tasks: RoadmapTask[];
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onNavigateToQuiz: (category?: string) => void;
  onNavigateToProjects: () => void;
}

const YEAR_OPTIONS: { id: BTechYear; label: string; desc: string }[] = [
  { id: '1st', label: '1st Year', desc: 'Foundations & Exploration' },
  { id: '2nd', label: '2nd Year', desc: 'Core CS & DSA Acceleration' },
  { id: '3rd', label: '3rd Year', desc: 'Internships, Systems & Projects' },
  { id: '4th', label: '4th Year', desc: 'Placement Drives & Mock Rounds' },
];

const BRANCH_OPTIONS: { id: BTechBranch; label: string }[] = [
  { id: 'CSE', label: 'Computer Science & Engg (CSE)' },
  { id: 'IT', label: 'Information Technology (IT)' },
  { id: 'AI_DS', label: 'AI & Data Science (AI/DS)' },
  { id: 'ECE', label: 'Electronics & Communication (ECE)' },
  { id: 'EE', label: 'Electrical Engineering (EE)' },
  { id: 'ME', label: 'Mechanical Engineering (ME)' },
  { id: 'CE', label: 'Civil Engineering (CE)' },
];

const CAREER_PATHS: { id: CareerPath; label: string; icon: string; desc: string }[] = [
  { id: 'sde', label: 'Software Development (SDE)', icon: '💻', desc: 'Data structures, backend/full-stack, systems & scale' },
  { id: 'aiml', label: 'AI & Machine Learning', icon: '🧠', desc: 'Deep learning, PyTorch, RAG architectures & NLP' },
  { id: 'data_analytics', label: 'Data Analytics & BI', icon: '📊', desc: 'SQL, Python, statistical modeling & data pipelines' },
  { id: 'cybersecurity', label: 'Cybersecurity & Defense', icon: '🛡️', desc: 'AppSec, OWASP Top 10, network forensics & IAM' },
  { id: 'core_embedded', label: 'Core & Embedded Systems', icon: '⚡', desc: 'Microcontrollers, FreeRTOS, robotics & hardware buses' },
  { id: 'cloud_devops', label: 'Cloud & Platform DevOps', icon: '☁️', desc: 'Docker, Kubernetes, CI/CD pipelines & reliability' },
];

export const BTechRoadmapView: React.FC<BTechRoadmapViewProps> = ({
  profile,
  tasks,
  onUpdateProfile,
  onToggleTask,
  onNavigateToQuiz,
  onNavigateToProjects,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedCount = tasks.filter((t) => profile.completedTasks.includes(t.id)).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesPhase = selectedPhase === 'all' || task.phaseId === selectedPhase;
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.keyTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPhase && matchesSearch;
  });

  // Group filtered tasks by phase
  const phases = [
    { id: 1, title: 'Phase 1: Foundations & Problem Solving (Weeks 1-4)' },
    { id: 2, title: 'Phase 2: Advanced Algorithms & Data Structures (Weeks 5-8)' },
    { id: 3, title: 'Phase 3: Core CS Subjects & System Architecture (Weeks 9-12)' },
    { id: 4, title: 'Phase 4: Specialization & Capstone Project (Weeks 13-14)' },
    { id: 5, title: 'Phase 5: Resume, Portfolio & Placement Readiness (Weeks 15-16)' },
  ];

  return (
    <div className="wrap max-w-[1240px] mx-auto py-6 space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#150F2B] via-[#241348] to-[#150F2B] border border-[#2B2052] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] text-xs font-semibold text-[#5EEAD4] mb-3">
              🎓 B.TECH PLACEMENT ACCELERATOR
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Personalized Placement Preparation Roadmap
            </h1>
            <p className="text-sm text-[#A096C8] mt-1 max-w-2xl">
              Tailored specifically to your current B.Tech year and target role. Track weekly learning goals, complete coding exercises, and build industry-grade projects.
            </p>
          </div>

          {/* Progress Ring / Gauge */}
          <div className="flex items-center gap-4 bg-[#07050D]/80 p-4 rounded-xl border border-[#2B2052] self-start md:self-auto">
            <div className="w-16 h-16 rounded-full bg-conic from-[#5EEAD4] via-[#A78BFA] to-[#2B2052] flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-[#07050D] flex items-center justify-center font-extrabold text-sm text-[#5EEAD4]">
                {progressPct}%
              </div>
            </div>
            <div>
              <div className="text-xs text-[#A096C8] uppercase font-semibold">Curriculum Progress</div>
              <div className="text-lg font-bold text-white">
                {completedCount} / {tasks.length} <span className="text-xs font-normal text-[#A096C8]">weeks done</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Configuration Card */}
      <div className="p-6 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>⚙️</span> Personalize Your Preparation Track
        </h2>

        {/* Year Selection */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#A096C8] mb-2 block">
            1. Select Your B.Tech Academic Year:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {YEAR_OPTIONS.map((y) => {
              const isSelected = profile.year === y.id;
              return (
                <button
                  key={y.id}
                  onClick={() => onUpdateProfile({ year: y.id })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#5EEAD4] bg-[#7C3AED]/20 shadow-md shadow-[#5EEAD4]/10'
                      : 'border-[#2B2052] bg-[#100B20] hover:border-[#A78BFA]/50'
                  }`}
                >
                  <div className={`font-bold text-sm ${isSelected ? 'text-[#5EEAD4]' : 'text-white'}`}>
                    {y.label}
                  </div>
                  <div className="text-[11px] text-[#A096C8] mt-0.5">{y.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Branch Selection */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#A096C8] mb-2 block">
            2. Select Your Engineering Branch:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {BRANCH_OPTIONS.map((b) => {
              const isSelected = profile.branch === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => onUpdateProfile({ branch: b.id })}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#A78BFA] bg-[#A78BFA]/20 text-white'
                      : 'border-[#2B2052] bg-[#100B20] text-[#A096C8] hover:text-white hover:border-[#A78BFA]/40'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Career Path Selection */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#A096C8] mb-2 block">
            3. Select Target Career Path:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CAREER_PATHS.map((cp) => {
              const isSelected = profile.targetPath === cp.id;
              return (
                <button
                  key={cp.id}
                  onClick={() => onUpdateProfile({ targetPath: cp.id, targetRole: cp.label })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'border-[#E879F9] bg-[#E879F9]/10 shadow-sm shadow-[#E879F9]/20'
                      : 'border-[#2B2052] bg-[#100B20] hover:border-[#A78BFA]/40'
                  }`}
                >
                  <span className="text-2xl">{cp.icon}</span>
                  <div>
                    <div className={`font-bold text-sm ${isSelected ? 'text-[#E879F9]' : 'text-white'}`}>
                      {cp.label}
                    </div>
                    <div className="text-[11px] text-[#A096C8] mt-0.5 leading-snug">{cp.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Phase navigation */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Phase selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedPhase === 'all'
                ? 'bg-[#7C3AED] text-white shadow-sm'
                : 'bg-[#150F2B] text-[#A096C8] hover:bg-[#100B20] border border-[#2B2052]'
            }`}
          >
            All Weeks ({tasks.length})
          </button>
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPhase(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedPhase === p.id
                  ? 'bg-[#7C3AED] text-white shadow-sm'
                  : 'bg-[#150F2B] text-[#A096C8] hover:bg-[#100B20] border border-[#2B2052]'
              }`}
            >
              Phase {p.id}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-64">
          <input
            type="search"
            placeholder="Search topics (e.g. Graphs, OS, DP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Tasks List grouped by Phase */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseTasks = filteredTasks.filter((t) => t.phaseId === phase.id);
          if (phaseTasks.length === 0) return null;

          const phaseCompleted = phaseTasks.filter((t) => profile.completedTasks.includes(t.id)).length;

          return (
            <div key={phase.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2B2052] pb-2">
                <h3 className="text-base font-bold text-[#F1ECFF] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                  {phase.title}
                </h3>
                <span className="text-xs text-[#A096C8]">
                  {phaseCompleted} / {phaseTasks.length} Completed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phaseTasks.map((task) => {
                  const isDone = profile.completedTasks.includes(task.id);

                  return (
                    <div
                      key={task.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-[#100B20]/90 border-[#5EEAD4]/60'
                          : 'bg-[#150F2B] border-[#2B2052] hover:border-[#A78BFA]/40'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#2B2052] text-[#A78BFA] text-xs font-bold">
                            Week {task.week}
                          </span>
                          <span className="text-xs font-medium text-[#A096C8]">{task.category}</span>
                        </div>
                        <button
                          onClick={() => onToggleTask(task.id, !isDone)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            isDone
                              ? 'bg-[#5EEAD4] text-[#07050D]'
                              : 'bg-[#100B20] text-[#A096C8] border border-[#2B2052] hover:border-[#5EEAD4]'
                          }`}
                        >
                          {isDone ? '✓ Completed' : 'Mark Done'}
                        </button>
                      </div>

                      {/* Title & Description */}
                      <h4 className={`text-base font-bold mb-1 ${isDone ? 'text-white' : 'text-[#F1ECFF]'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-[#A096C8] leading-relaxed mb-3">{task.description}</p>

                      {/* Key Topics tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {task.keyTopics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-[#100B20] text-[#A78BFA] border border-[#2B2052]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Practice Exercises */}
                      <div className="pt-3 border-t border-[#2B2052]/60 space-y-1.5">
                        <div className="text-[11px] uppercase tracking-wider text-[#A096C8] font-bold">
                          Practical Milestones:
                        </div>
                        {task.practiceExercises.map((ex, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-[#F1ECFF]">
                            <span className="flex items-center gap-1.5">
                              <span className="text-[#5EEAD4]">•</span> {ex.title}
                            </span>
                            {ex.type === 'quiz' && (
                              <button
                                onClick={() => onNavigateToQuiz(task.category)}
                                className="text-[11px] text-[#5EEAD4] hover:underline font-semibold"
                              >
                                Take Quiz →
                              </button>
                            )}
                            {ex.type === 'project' && (
                              <button
                                onClick={onNavigateToProjects}
                                className="text-[11px] text-[#E879F9] hover:underline font-semibold"
                              >
                                View Blueprint →
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-8 text-center bg-[#150F2B] border border-[#2B2052] rounded-2xl text-[#A096C8]">
            No roadmap tasks match your search filter.
          </div>
        )}
      </div>
    </div>
  );
};
