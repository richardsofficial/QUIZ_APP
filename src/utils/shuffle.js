/**
 * Fisher-Yates pure shuffle implementation.
 * Returns a new shuffled array without mutating the original.
 */
export function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Prepares and randomizes questions and options for a quiz attempt.
 *
 * @param {Array} allCategoryQuestions - All questions available for the category.
 * @param {number} requestedCount - Desired number of questions (e.g. 5, 10, 15).
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' | 'mixed'.
 * @returns {Array} Prepared randomized questions.
 */
export function prepareQuizQuestions(allCategoryQuestions, requestedCount = 10, difficulty = 'mixed') {
  if (!allCategoryQuestions || allCategoryQuestions.length === 0) {
    return [];
  }

  // Filter by difficulty if specified and not 'mixed'
  let pool = allCategoryQuestions;
  if (difficulty && difficulty.toLowerCase() !== 'mixed') {
    const filtered = allCategoryQuestions.filter(
      (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
    // If we have enough matching the difficulty, use them.
    // If not, supplement with other questions to fulfill the count safely.
    if (filtered.length >= requestedCount) {
      pool = filtered;
    } else if (filtered.length > 0) {
      // Use filtered first, plus other shuffled category questions as fallback
      const others = allCategoryQuestions.filter(
        (q) => q.difficulty.toLowerCase() !== difficulty.toLowerCase()
      );
      pool = [...filtered, ...shuffleArray(others)];
    }
  }

  // Shuffle the pool of questions
  const shuffledPool = shuffleArray(pool);

  // Take the requested number (or maximum available)
  const selectedQuestions = shuffledPool.slice(0, Math.min(requestedCount, shuffledPool.length));

  // Now randomize options for each individual question
  return selectedQuestions.map((q, index) => {
    const shuffledOptions = shuffleArray(q.options);
    
    // Safety check: ensure correct answer is preserved
    if (!shuffledOptions.includes(q.correctAnswer)) {
      console.warn(`Warning: correctAnswer "${q.correctAnswer}" missing from options for question ${q.id}`);
    }

    return {
      ...q,
      originalIndex: index,
      displayIndex: index + 1,
      options: shuffledOptions,
    };
  });
}
