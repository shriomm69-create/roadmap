import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateIdf,
  isItemKnown,
  getItemWeight,
  calculateRoleScore,
  getFitTier,
  generateBTechCurriculum,
  computeSkillGapAnalysis,
  computePlacementReadiness,
} from './roadmapLogic.ts';
import type { StudentProfile, QuizAttempt } from '../types/index.ts';

test('calculateIdf computes correct inverse frequency score', () => {
  const val1 = calculateIdf(0, 100, 10);
  assert.ok(val1 > 0);
  const valRare = calculateIdf(1, 100, 1);
  const valCommon = calculateIdf(2, 100, 50);
  assert.ok(valRare > valCommon, 'Rare skill must have higher IDF than common skill');
});

test('isItemKnown detects directly known and aliased skills', () => {
  const known = new Set([5, 10]);
  const aliasMap = { 20: [10, 12] };

  assert.equal(isItemKnown(5, known, aliasMap), true);
  assert.equal(isItemKnown(99, known, aliasMap), false);
  // Alias test
  assert.equal(isItemKnown(20, known, aliasMap), true);
  // Array item test (one of group)
  assert.equal(isItemKnown([99, 100, 5], known, aliasMap), true);
  assert.equal(isItemKnown([98, 99], known, aliasMap), false);
});

test('calculateRoleScore calculates fit percentage and items known', () => {
  const role = {
    g: [
      ['Core Programming', 0, [1, 2]],
      ['Advanced Systems', 1, [3, 4]],
    ] as [string, number, (number | number[])[]][],
  };
  const skillsList: [string, number][] = [
    ['None', 0],
    ['C++', 10],
    ['Python', 15],
    ['Linux', 5],
    ['Distributed', 2],
  ];
  const known = new Set([1, 2]);
  const aliasMap = {};

  const score = calculateRoleScore(role, known, 100, skillsList, aliasMap, 5);
  assert.ok(score.have === 2);
  assert.ok(score.tot === 4);
  assert.ok(score.p > 0 && score.p <= 1);
});

test('getFitTier returns expected tier strings', () => {
  assert.equal(getFitTier(0.5), 'Strong fit');
  assert.equal(getFitTier(0.3), 'Solid fit');
  assert.equal(getFitTier(0.15), 'Building');
  assert.equal(getFitTier(0.05), 'Early');
});

test('generateBTechCurriculum generates weeks covering all phases', () => {
  const tasks = generateBTechCurriculum('3rd', 'CSE', 'sde');
  assert.ok(tasks.length >= 14, 'Should generate at least 14 weekly tasks');
  assert.ok(tasks.some((t) => t.category.includes('Programming') || t.category.includes('Linear')));
  assert.ok(tasks.some((t) => t.category.includes('Operating Systems')));
  assert.ok(tasks.some((t) => t.category.includes('DBMS')));
  assert.ok(tasks.some((t) => t.category.includes('Computer Networks')));
  assert.ok(tasks.some((t) => t.category.includes('Resume') || t.category.includes('Interview')));
});

test('computeSkillGapAnalysis prioritizes weak quiz categories', () => {
  const attempts: QuizAttempt[] = [
    {
      id: 'att-1',
      timestamp: '2026-10-23T00:00:00Z',
      category: 'Operating Systems',
      difficulty: 'Medium',
      score: 2,
      total: 10, // 20%
      accuracy: 20,
      timeSpentSeconds: 120,
      topicBreakdown: {},
      userAnswers: [],
    },
    {
      id: 'att-2',
      timestamp: '2026-10-23T01:00:00Z',
      category: 'DBMS',
      difficulty: 'Medium',
      score: 9,
      total: 10, // 90%
      accuracy: 90,
      timeSpentSeconds: 140,
      topicBreakdown: {},
      userAnswers: [],
    },
  ];

  const gaps = computeSkillGapAnalysis(attempts, []);
  assert.ok(gaps.length > 0);
  const osGap = gaps.find((g) => g.category === 'Operating Systems');
  const dbmsGap = gaps.find((g) => g.category === 'DBMS');

  assert.ok(osGap);
  assert.equal(osGap.status, 'Needs Practice');
  assert.ok(dbmsGap);
  assert.equal(dbmsGap.status, 'Solid');
  // Order check: Needs Practice appears first
  assert.equal(gaps[0].status, 'Needs Practice');
});

test('computePlacementReadiness combines roadmap, quiz, and project metrics', () => {
  const profile: StudentProfile = {
    name: 'Aarav Sharma',
    year: '3rd',
    branch: 'CSE',
    targetPath: 'sde',
    targetRole: 'Software Development Engineer',
    completedTasks: ['w1', 'w2', 'w3', 'w4'],
    bookmarkedQuizzes: [],
    resumeChecklist: { resume: true, github: true },
    customProjects: [
      {
        id: 'p1',
        title: 'Distributed KV Store',
        path: 'sde',
        difficulty: 'Advanced',
        status: 'Completed',
      },
    ],
  };

  const tasks = generateBTechCurriculum('3rd', 'CSE', 'sde');
  const attempts: QuizAttempt[] = [
    {
      id: '1',
      timestamp: '',
      category: 'DSA',
      difficulty: 'Easy',
      score: 8,
      total: 10,
      accuracy: 80,
      timeSpentSeconds: 100,
      topicBreakdown: {},
      userAnswers: [],
    },
  ];

  const metrics = computePlacementReadiness(profile, tasks, attempts, 8);
  assert.ok(metrics.readinessPercentage > 0 && metrics.readinessPercentage <= 100);
  assert.equal(metrics.tasksCompletedCount, 4);
  assert.equal(metrics.projectsCompletedCount, 1);
  assert.equal(metrics.quizzesAttemptedCount, 1);
});
