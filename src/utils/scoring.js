/**
 * Calculates quiz scoring metrics based on questions and user answers.
 *
 * @param {Array} questions - Array of quiz questions.
 * @param {Object} userAnswers - Key-value map of { [questionId]: selectedOptionString }.
 * @param {number} timeSpentSeconds - Time taken in seconds.
 * @param {string} submissionType - 'manual' | 'timeout'.
 * @returns {Object} Full scoring result.
 */
export function calculateQuizResults(questions = [], userAnswers = {}, timeSpentSeconds = 0, submissionType = 'manual') {
  const totalQuestions = questions.length;
  let attempted = 0;
  let correct = 0;
  let incorrect = 0;

  const questionBreakdown = questions.map((q) => {
    const selectedAnswer = userAnswers[q.id];
    const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== '';
    const isCorrect = isAnswered && selectedAnswer === q.correctAnswer;

    if (isAnswered) {
      attempted += 1;
      if (isCorrect) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    }

    return {
      ...q,
      selectedAnswer: isAnswered ? selectedAnswer : null,
      isAnswered,
      isCorrect,
      status: !isAnswered ? 'unanswered' : isCorrect ? 'correct' : 'incorrect',
    };
  });

  const unanswered = Math.max(0, totalQuestions - attempted);
  const score = correct;
  const maxScore = totalQuestions;

  // Percentage = (correct / total) * 100
  const rawPercentage = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
  const percentage = Math.round(rawPercentage * 10) / 10;

  // Accuracy = (correct / attempted) * 100, or 0 if attempted === 0
  const rawAccuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
  const accuracy = Math.round(rawAccuracy * 10) / 10;

  let tier = 'Keep Practicing';
  let tierBadge = 'Needs Practice';
  let tierMessage = 'Keep practicing! Reviewing the detailed answers below will sharpen your knowledge.';
  let tierColor = '#ef4444'; // Red

  if (percentage >= 90) {
    tier = 'Excellent';
    tierBadge = 'Mastery Achieved';
    tierMessage = 'Outstanding performance! You have demonstrated exceptional mastery in this topic!';
    tierColor = '#10b981'; // Green
  } else if (percentage >= 75) {
    tier = 'Great Job';
    tierBadge = 'Proficient';
    tierMessage = 'Impressive work! You have a solid grasp and high precision across these questions.';
    tierColor = '#3b82f6'; // Blue
  } else if (percentage >= 50) {
    tier = 'Good Effort';
    tierBadge = 'Competent';
    tierMessage = 'Good effort! You are making steady progress. Review the answers below to reach the top tier.';
    tierColor = '#f59e0b'; // Amber
  }

  return {
    totalQuestions,
    attempted,
    unanswered,
    correct,
    incorrect,
    score,
    maxScore,
    percentage,
    accuracy,
    timeSpentSeconds,
    submissionType,
    tier,
    tierBadge,
    tierMessage,
    tierColor,
    questionBreakdown,
  };
}

/**
 * Formats seconds into mm:ss format.
 */
export function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
