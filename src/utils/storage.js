const STATS_KEY = 'quizmaster_v1_stats';
const HISTORY_KEY = 'quizmaster_v1_history';
const LAST_CONFIG_KEY = 'quizmaster_v1_last_config';

// In-memory fallback in case localStorage is disabled or throws
let memoryStats = null;
let memoryHistory = null;
let memoryLastConfig = null;

function isLocalStorageAvailable() {
  try {
    const testKey = '__qm_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const defaultStats = {
  totalAttempts: 0,
  overallBestPercentage: 0,
  categoryBests: {}, // { [categoryId]: { score, totalQuestions, percentage, date } }
};

/**
 * Retrieves the aggregated statistics from storage.
 */
export function getStats() {
  if (!isLocalStorageAvailable()) {
    return memoryStats || { ...defaultStats };
  }
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return { ...defaultStats };
    const parsed = JSON.parse(raw);
    return {
      totalAttempts: typeof parsed.totalAttempts === 'number' ? parsed.totalAttempts : 0,
      overallBestPercentage: typeof parsed.overallBestPercentage === 'number' ? parsed.overallBestPercentage : 0,
      categoryBests: parsed.categoryBests && typeof parsed.categoryBests === 'object' ? parsed.categoryBests : {},
    };
  } catch (err) {
    console.warn('Error reading stats from localStorage, using default:', err);
    return { ...defaultStats };
  }
}

/**
 * Retrieves quiz history attempts list (most recent first).
 */
export function getHistory() {
  if (!isLocalStorageAvailable()) {
    return memoryHistory || [];
  }
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading history from localStorage:', err);
    return [];
  }
}

/**
 * Saves a completed quiz result and updates best scores.
 */
export function recordQuizAttempt({ categoryId, categoryName, score, totalQuestions, percentage, accuracy, timeSpentSeconds, submissionType, difficulty }) {
  const currentStats = getStats();
  const currentHistory = getHistory();

  const attemptRecord = {
    id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    categoryId,
    categoryName,
    difficulty,
    score,
    totalQuestions,
    percentage,
    accuracy,
    timeSpentSeconds,
    submissionType,
    date: new Date().toISOString(),
    formattedDate: new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Update total attempts
  const newTotalAttempts = currentStats.totalAttempts + 1;

  // Update overall best percentage
  const newOverallBest = Math.max(currentStats.overallBestPercentage, percentage);

  // Update category best score logic
  const updatedCategoryBests = { ...currentStats.categoryBests };
  const existingCatBest = updatedCategoryBests[categoryId];

  let shouldUpdateCatBest = false;
  if (!existingCatBest) {
    shouldUpdateCatBest = true;
  } else {
    // Better according to percentage
    if (percentage > existingCatBest.percentage) {
      shouldUpdateCatBest = true;
    } else if (percentage === existingCatBest.percentage) {
      // If two attempts have the same percentage, prefer the higher raw score only when the number of questions differs;
      // for identical quiz lengths, preserve existing
      if (totalQuestions > existingCatBest.totalQuestions && score > existingCatBest.score) {
        shouldUpdateCatBest = true;
      }
    }
  }

  if (shouldUpdateCatBest) {
    updatedCategoryBests[categoryId] = {
      score,
      totalQuestions,
      percentage,
      difficulty,
      date: attemptRecord.date,
      formattedDate: attemptRecord.formattedDate,
    };
  }

  const updatedStats = {
    totalAttempts: newTotalAttempts,
    overallBestPercentage: newOverallBest,
    categoryBests: updatedCategoryBests,
  };

  // Keep last 50 attempts for history
  const updatedHistory = [attemptRecord, ...currentHistory].slice(0, 50);

  // Persist
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Failed saving to localStorage:', e);
    }
  } else {
    memoryStats = updatedStats;
    memoryHistory = updatedHistory;
  }

  return { updatedStats, updatedHistory, attemptRecord, isNewBest: shouldUpdateCatBest };
}

/**
 * Saves last selected configuration for convenience.
 */
export function saveLastConfig(config) {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(LAST_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {}
  } else {
    memoryLastConfig = config;
  }
}

/**
 * Gets last selected configuration.
 */
export function getLastConfig() {
  if (isLocalStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(LAST_CONFIG_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  return memoryLastConfig;
}

/**
 * Clears all quiz history and stats with safety.
 */
export function clearAllHistory() {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(STATS_KEY);
      window.localStorage.removeItem(HISTORY_KEY);
      window.localStorage.removeItem(LAST_CONFIG_KEY);
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  }
  memoryStats = { ...defaultStats };
  memoryHistory = [];
  memoryLastConfig = null;
  return { stats: { ...defaultStats }, history: [] };
}
