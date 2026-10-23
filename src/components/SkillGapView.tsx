import React from 'react';
import type { QuizAttempt, SkillGapItem, StudentProfile } from '../types/index.ts';
import { computeSkillGapAnalysis } from '../utils/roadmapLogic.ts';

interface SkillGapViewProps {
  profile: StudentProfile;
  quizHistory: QuizAttempt[];
  onTakeQuiz: (category: string) => void;
  onJumpToRoadmap: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  profile,
  quizHistory,
  onTakeQuiz,
  onJumpToRoadmap,
}) => {
  const gapItems: SkillGapItem[] = computeSkillGapAnalysis(
    quizHistory,
    profile.completedTasks
  );

  const needsPractice = gapItems.filter((g) => g.status === 'Needs Practice');
  const developing = gapItems.filter((g) => g.status === 'Developing');
  const solid = gapItems.filter((g) => g.status === 'Solid');

  return (
    <div className="wrap max-w-[1180px] mx-auto py-6 space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#150F2B] via-[#241348] to-[#150F2B] border border-[#2B2052] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] text-xs font-semibold text-[#5EEAD4]">
          🔬 CONTINUOUS DIAGNOSTICS & GAP ANALYSIS
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Automated Skill Gap Analysis
        </h1>
        <p className="text-xs md:text-sm text-[#A096C8] max-w-2xl leading-relaxed">
          Pinpoints topics where accuracy falls short of competitive placement benchmarks. Focus your revision where it yields the highest return on investment.
        </p>
      </div>

      {/* Transparent Methodology Explainer */}
      <div className="p-5 rounded-2xl bg-[#100B20] border border-[#2B2052] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
          <span>ℹ️</span> How Recommendations Are Generated
        </div>
        <p className="text-xs text-[#A096C8] leading-relaxed">
          Our recommendation model dynamically aggregates your actual quiz scores and verified weekly milestones across core CS subjects.
          Topics scoring <b>&lt; 50% accuracy</b> are classified as <span className="text-red-400 font-semibold">Needs Practice</span> and given top revision priority.
          Topics scoring <b>50% – 74%</b> are categorized as <span className="text-[#A78BFA] font-semibold">Developing</span>, and topics scoring <b>&ge; 75%</b> are confirmed as <span className="text-[#5EEAD4] font-semibold">Solid Strengths</span>.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#150F2B] border border-red-500/30">
          <div className="text-xs text-red-400 font-semibold uppercase">Needs Immediate Practice</div>
          <div className="text-2xl font-extrabold text-white mt-1">{needsPractice.length} Topics</div>
          <div className="text-[11px] text-[#A096C8] mt-1">High probability of interview stumbling</div>
        </div>
        <div className="p-4 rounded-xl bg-[#150F2B] border border-[#A78BFA]/30">
          <div className="text-xs text-[#A78BFA] font-semibold uppercase">Developing Baseline</div>
          <div className="text-2xl font-extrabold text-white mt-1">{developing.length} Topics</div>
          <div className="text-[11px] text-[#A096C8] mt-1">Solid fundamentals, need speed & edge drills</div>
        </div>
        <div className="p-4 rounded-xl bg-[#150F2B] border border-[#5EEAD4]/30">
          <div className="text-xs text-[#5EEAD4] font-semibold uppercase">Solid Strengths</div>
          <div className="text-2xl font-extrabold text-white mt-1">{solid.length} Topics</div>
          <div className="text-[11px] text-[#A096C8] mt-1">Ready for high-difficulty technical rounds</div>
        </div>
      </div>

      {/* SECTION 1: TOPICS NEEDING IMMEDIATE PRACTICE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B2052] pb-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span>
            Priority Revision Modules ({needsPractice.length})
          </h2>
          <span className="text-xs text-[#A096C8]">Requires attention before mock interviews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {needsPractice.map((gap, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#150F2B] border border-red-500/40 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                    {gap.category}
                  </span>
                  <h3 className="text-base font-bold text-white">{gap.topic}</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-red-400 font-mono">
                    {gap.accuracyPct}%
                  </span>
                  <div className="text-[10px] text-[#A096C8]">{gap.totalAttempts} tests</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-[#100B20] overflow-hidden">
                <div
                  className="h-full bg-red-400 transition-all"
                  style={{ width: `${Math.max(5, gap.accuracyPct)}%` }}
                ></div>
              </div>

              <p className="text-xs text-[#A096C8] leading-relaxed">{gap.recommendation}</p>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#2B2052]">
                <span className="text-xs font-semibold text-[#F1ECFF] flex items-center gap-1.5">
                  <span>👉</span> {gap.actionTask}
                </span>
                <button
                  onClick={() => onTakeQuiz(gap.quizCategory)}
                  className="btn py-1.5 px-3 text-xs bg-gradient-to-r from-red-500 to-[#E879F9] text-white font-bold"
                >
                  Practice Quiz →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DEVELOPING & SOLID STRENGTHS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Developing topics */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#A78BFA] uppercase tracking-wider">
            Developing Topics ({developing.length})
          </h3>
          {developing.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#150F2B] text-xs text-[#A096C8]">
              No topics in developing range. Complete more quizzes to establish benchmarks.
            </div>
          ) : (
            developing.map((gap, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#150F2B] border border-[#A78BFA]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{gap.topic}</span>
                  <span className="text-xs font-mono font-bold text-[#A78BFA]">{gap.accuracyPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#100B20] overflow-hidden">
                  <div className="h-full bg-[#A78BFA]" style={{ width: `${gap.accuracyPct}%` }}></div>
                </div>
                <p className="text-xs text-[#A096C8]">{gap.recommendation}</p>
                <button
                  onClick={() => onTakeQuiz(gap.quizCategory)}
                  className="text-xs text-[#5EEAD4] hover:underline font-semibold"
                >
                  Strengthen with 5 Questions →
                </button>
              </div>
            ))
          )}
        </div>

        {/* Solid Strengths */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#5EEAD4] uppercase tracking-wider">
            Solid Strengths ({solid.length})
          </h3>
          {solid.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#150F2B] text-xs text-[#A096C8]">
              Score 75%+ on subject quizzes to verify solid strengths.
            </div>
          ) : (
            solid.map((gap, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#150F2B] border border-[#5EEAD4]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{gap.topic}</span>
                  <span className="text-xs font-mono font-bold text-[#5EEAD4]">{gap.accuracyPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#100B20] overflow-hidden">
                  <div className="h-full bg-[#5EEAD4]" style={{ width: `${gap.accuracyPct}%` }}></div>
                </div>
                <p className="text-xs text-[#A096C8]">{gap.recommendation}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
