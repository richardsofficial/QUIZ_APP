import { QUESTIONS } from './src/data/questions.js';
import { CATEGORIES } from './src/data/categories.js';
import { shuffleArray, prepareQuizQuestions } from './src/utils/shuffle.js';
import { calculateQuizResults } from './src/utils/scoring.js';
import { recordQuizAttempt, getStats, clearAllHistory } from './src/utils/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('--- STARTING QUIZMASTER UNIT TESTS ---');

// 1. Data Integrity Tests
assert(CATEGORIES.length === 8, '8 categories defined');
assert(QUESTIONS.length >= 120, 'At least 120 questions defined in question bank');

CATEGORIES.forEach((cat) => {
  const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
  assert(catQuestions.length >= 15, `Category "${cat.name}" has at least 15 questions (found ${catQuestions.length})`);
  
  // Verify difficulty distribution
  const easy = catQuestions.filter((q) => q.difficulty === 'easy');
  const medium = catQuestions.filter((q) => q.difficulty === 'medium');
  const hard = catQuestions.filter((q) => q.difficulty === 'hard');
  assert(easy.length >= 3 && medium.length >= 3 && hard.length >= 3, `Category "${cat.name}" has balanced difficulty levels (easy: ${easy.length}, med: ${medium.length}, hard: ${hard.length})`);

  // Verify all questions have 4 options and valid correct answer
  catQuestions.forEach((q) => {
    assert(q.options.length === 4, `Question ${q.id} has exactly 4 options`);
    assert(q.options.includes(q.correctAnswer), `Question ${q.id} has correct answer matching an option`);
    assert(Boolean(q.explanation), `Question ${q.id} has explanation`);
  });
});

// 2. Randomization & Option Shuffling Tests
const sampleQuestions = QUESTIONS.filter((q) => q.category === 'computer-science');
const prepared = prepareQuizQuestions(sampleQuestions, 10, 'mixed');
assert(prepared.length === 10, 'Prepares requested question count of 10');
prepared.forEach((pq) => {
  assert(pq.options.length === 4, `Prepared question ${pq.id} maintains 4 options`);
  assert(pq.options.includes(pq.correctAnswer), `Prepared question ${pq.id} preserves correct answer in options`);
});

// 3. Scoring Tests
const mockQuestions = [
  { id: 'q1', correctAnswer: 'A' },
  { id: 'q2', correctAnswer: 'B' },
  { id: 'q3', correctAnswer: 'C' },
  { id: 'q4', correctAnswer: 'D' },
];

// All correct
const res1 = calculateQuizResults(mockQuestions, { q1: 'A', q2: 'B', q3: 'C', q4: 'D' }, 45, 'manual');
assert(res1.score === 4 && res1.percentage === 100 && res1.attempted === 4 && res1.unanswered === 0 && res1.accuracy === 100, 'Scoring: 100% correct score calculation');
assert(res1.tier === 'Excellent', 'Scoring: 100% gives tier "Excellent"');

// 2 correct, 1 incorrect, 1 unanswered
const res2 = calculateQuizResults(mockQuestions, { q1: 'A', q2: 'B', q3: 'WRONG' }, 60, 'manual');
assert(res2.score === 2, 'Scoring: 2 correct');
assert(res2.attempted === 3, 'Scoring: 3 attempted');
assert(res2.unanswered === 1, 'Scoring: 1 unanswered');
assert(res2.incorrect === 1, 'Scoring: 1 incorrect');
assert(res2.percentage === 50, 'Scoring: percentage is 50%');
assert(res2.accuracy === 66.7, `Scoring: accuracy is (2/3)*100 = 66.7% (got ${res2.accuracy})`);
assert(res2.tier === 'Good Effort', 'Scoring: 50% gives tier "Good Effort"');

// Zero attempted
const res3 = calculateQuizResults(mockQuestions, {}, 120, 'timeout');
assert(res3.score === 0 && res3.attempted === 0 && res3.unanswered === 4 && res3.accuracy === 0, 'Scoring: zero attempted safe division by zero');
assert(res3.submissionType === 'timeout', 'Scoring: records timeout submission mode');
assert(res3.tier === 'Keep Practicing', 'Scoring: 0% gives tier "Keep Practicing"');

// 4. Persistence & Tie-Breaking Rules Test
clearAllHistory();
// Mock window.localStorage in node if needed or test in-memory fallback
const mockAttempt1 = {
  categoryId: 'science',
  categoryName: 'Science',
  score: 4,
  totalQuestions: 5,
  percentage: 80,
  accuracy: 80,
  timeSpentSeconds: 60,
  submissionType: 'manual',
  difficulty: 'mixed',
};
const save1 = recordQuizAttempt(mockAttempt1);
assert(save1.isNewBest === true, 'First attempt is recorded as new category best');

// Same category, lower score
const mockAttempt2 = {
  categoryId: 'science',
  categoryName: 'Science',
  score: 3,
  totalQuestions: 5,
  percentage: 60,
  accuracy: 60,
  timeSpentSeconds: 60,
  submissionType: 'manual',
  difficulty: 'mixed',
};
const save2 = recordQuizAttempt(mockAttempt2);
assert(save2.isNewBest === false, 'Lower percentage does not overwrite best score');

// Same percentage (80%), but more questions (8/10 vs 4/5)
const mockAttempt3 = {
  categoryId: 'science',
  categoryName: 'Science',
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  accuracy: 80,
  timeSpentSeconds: 120,
  submissionType: 'manual',
  difficulty: 'mixed',
};
const save3 = recordQuizAttempt(mockAttempt3);
assert(save3.isNewBest === true, 'Tie-break: same percentage prefers higher question count / raw score');

console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) {
  process.exit(1);
}
