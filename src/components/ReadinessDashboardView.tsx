import React from 'react';
import type {
  PlacementReadinessMetrics,
  RoadmapTask,
  StudentProfile,
} from '../types/index.ts';

interface ReadinessDashboardViewProps {
  profile: StudentProfile;
  metrics: PlacementReadinessMetrics;
  tasks: RoadmapTask[];
  onToggleChecklist: (key: string, value: boolean) => void;
  onNavigateToRoadmap: () => void;
  onNavigateToQuiz: () => void;
  onNavigateToProjects: () => void;
}

const CHECKLIST_ITEMS = [
  { key: 'atsFormat', label: '1-Page ATS Standard Resume', desc: 'Formatted with clean single-column structure and quantified impact bullets' },
  { key: 'githubLinks', label: 'GitHub Pinned Repositories', desc: 'At least 2 well-documented repositories with architecture diagrams and live demos' },
  { key: 'leetcode50', label: '50+ Core LeetCode Patterns Solved', desc: 'Sliding window, two pointers, BFS/DFS, binary trees, dynamic programming' },
  { key: 'projectsDeployed', label: '2 Capstone Projects Live on Cloud', desc: 'Deployed with public URLs on Vercel, Render, Cloud Run, or AWS' },
  { key: 'csCoreRevision', label: 'Core CS Subject Cheat Sheets Mastered', desc: 'OS processes & paging, DBMS normalization & ACID, Computer Networks TCP & DNS' },
  { key: 'mockInterview', label: '3 Mock Technical Interviews Conducted', desc: 'Practiced speaking thoughts aloud while writing code under 45-minute timed sessions' },
  { key: 'starStories', label: '5 Behavioral STAR Stories Prepared', desc: 'Prepared situations covering technical challenges, conflict resolution, and leadership' },
  { key: 'linkedinUpdated', label: 'LinkedIn Profile & Resume Synced', desc: 'Headline tailored to target role with project tech stacks and verified skills' },
];

export const ReadinessDashboardView: React.FC<ReadinessDashboardViewProps> = ({
  profile,
  metrics,
  tasks,
  onToggleChecklist,
  onNavigateToRoadmap,
  onNavigateToQuiz,
  onNavigateToProjects,
}) => {
  return (
    <div className="wrap max-w-[1180px] mx-auto py-6 space-y-8">
      {/* Disclaimer Banner: Strictly labeled as progress indicator */}
      <div className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] flex items-center gap-3 text-xs text-[#A096C8]">
        <span className="text-lg">🛡️</span>
        <div>
          <b className="text-white">Notice:</b> This dashboard serves strictly as an objective{' '}
          <span className="text-[#5EEAD4] font-semibold">preparation-progress indicator</span> tracking
          your curriculum completion, problem-solving drills, and project milestones. It is not an employment guarantee or selection probability.
        </div>
      </div>

      {/* Main Readiness Gauge Hero Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#150F2B] via-[#2A1458] to-[#150F2B] border border-[#7C3AED] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/30 text-xs font-semibold text-[#5EEAD4] border border-[#5EEAD4]/30">
              CAMPUS PLACEMENT READINESS SCORE
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {profile.targetRole || 'Software Development Engineer'} Track
            </h1>
            <p className="text-xs md:text-sm text-[#A096C8] leading-relaxed">
              Based on your verified {metrics.tasksCompletedCount} roadmap weeks, {metrics.quizzesAttemptedCount} completed quiz sessions ({metrics.quizAccuracy}% accuracy), and {metrics.projectsCompletedCount} capstone projects.
            </p>
          </div>

          {/* Large Conic Circular Gauge */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center p-3 relative shadow-2xl shadow-[#7C3AED]/40"
              style={{
                background: `conic-gradient(#5EEAD4 0% ${metrics.readinessPercentage}%, #2B2052 ${metrics.readinessPercentage}% 100%)`,
              }}
            >
              <div className="w-full h-full rounded-full bg-[#07050D] flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {metrics.readinessPercentage}%
                </span>
                <span className="text-[10px] uppercase font-bold text-[#5EEAD4] tracking-wider">
                  Readiness
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#A096C8]">
              Target: 85%+ for Tier-1 Product Companies
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pillar 1: Roadmap */}
        <div className="p-4 rounded-xl bg-[#150F2B] border border-[#2B2052] space-y-1">
          <div className="text-[11px] uppercase font-bold text-[#A096C8]">Roadmap Progress</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {metrics.roadmapProgress}%
          </div>
          <div className="text-xs text-[#A096C8]">
            {metrics.tasksCompletedCount} of {metrics.tasksTotalCount} weeks verified
          </div>
        </div>

        {/* Pillar 2: Quiz Accuracy */}
        <div className="p-4 rounded-xl bg-[#150F2B] border border-[#2B2052] space-y-1">
          <div className="text-[11px] uppercase font-bold text-[#A096C8]">Quiz Accuracy</div>
          <div className="text-2xl font-extrabold text-[#5EEAD4] font-mono">
            {metrics.quizAccuracy}%
          </div>
          <div className="text-xs text-[#A096C8]">
            {metrics.quizzesAttemptedCount} assessments logged
          </div>
        </div>

        {/* Pillar 3: Projects */}
        <div className="p-4 rounded-xl bg-[#150F2B] border border-[#2B2052] space-y-1">
          <div className="text-[11px] uppercase font-bold text-[#A096C8]">Projects Completed</div>
          <div className="text-2xl font-extrabold text-[#E879F9] font-mono">
            {metrics.projectsCompletedCount}
          </div>
          <div className="text-xs text-[#A096C8]">
            Portfolio capstones built
          </div>
        </div>

        {/* Pillar 4: Resume Checklist */}
        <div className="p-4 rounded-xl bg-[#150F2B] border border-[#2B2052] space-y-1">
          <div className="text-[11px] uppercase font-bold text-[#A096C8]">Checklist Verified</div>
          <div className="text-2xl font-extrabold text-[#A78BFA] font-mono">
            {metrics.resumeChecklistCompletedCount} / {metrics.resumeChecklistTotalCount}
          </div>
          <div className="text-xs text-[#A096C8]">
            Key hiring requirements checked
          </div>
        </div>
      </div>

      {/* Suggested Next Steps */}
      <div className="p-6 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>🚀</span> Recommended Immediate Next Steps:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-[#5EEAD4]">1. Core Revision Priority</div>
              <p className="text-xs text-[#A096C8] mt-1">
                {metrics.skillsNeedingRevisionCount > 0
                  ? `You have ${metrics.skillsNeedingRevisionCount} subjects marked as needing practice in diagnostic analysis.`
                  : 'Great job maintaining high quiz accuracy across tested subjects!'}
              </p>
            </div>
            <button
              onClick={onNavigateToQuiz}
              className="text-xs font-bold text-[#5EEAD4] hover:underline text-left mt-2"
            >
              Take Practice Quiz →
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-[#A78BFA]">2. Advance Next Week</div>
              <p className="text-xs text-[#A096C8] mt-1">
                Continue through Phase {Math.min(5, Math.floor(metrics.tasksCompletedCount / 4) + 1)} weekly milestone drills.
              </p>
            </div>
            <button
              onClick={onNavigateToRoadmap}
              className="text-xs font-bold text-[#A78BFA] hover:underline text-left mt-2"
            >
              Open Roadmap Tasks →
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-[#E879F9]">3. Deploy Capstone Project</div>
              <p className="text-xs text-[#A096C8] mt-1">
                Build a portfolio project with live URL and clean GitHub README to stand out in resume screening.
              </p>
            </div>
            <button
              onClick={onNavigateToProjects}
              className="text-xs font-bold text-[#E879F9] hover:underline text-left mt-2"
            >
              View Project Blueprints →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Resume & Interview Preparation Checklist */}
      <div className="p-6 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📋</span> Resume & Interview Preparation Checklist
          </h2>
          <span className="text-xs text-[#5EEAD4] font-semibold">
            {metrics.resumeChecklistCompletedCount} of {metrics.resumeChecklistTotalCount} Done
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = Boolean(profile.resumeChecklist?.[item.key]);

            return (
              <label
                key={item.key}
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#100B20] border-[#5EEAD4]/50'
                    : 'bg-[#100B20]/60 border-[#2B2052] hover:border-[#A78BFA]/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => onToggleChecklist(item.key, e.target.checked)}
                  className="mt-1 accent-[#5EEAD4] w-4 h-4 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className={`text-sm font-bold ${isChecked ? 'text-[#5EEAD4]' : 'text-white'}`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-[#A096C8]">{item.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
