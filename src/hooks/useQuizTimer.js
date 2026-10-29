import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for a rock-solid, drift-free countdown timer.
 * Uses system timestamps (Date.now()) to guarantee accurate timing even
 * if the browser tab is throttled, navigated, or backgrounded.
 *
 * @param {number} totalDurationSeconds - Total quiz duration in seconds.
 * @param {Function} onTimeout - Callback executed once when timer hits 0.
 * @param {boolean} isRunning - Whether timer is active.
 */
export function useQuizTimer({ totalDurationSeconds, onTimeout, isRunning = true }) {
  const [timeLeft, setTimeLeft] = useState(totalDurationSeconds);
  const [isWarning, setIsWarning] = useState(false);

  const startTimeRef = useRef(null);
  const totalDurationRef = useRef(totalDurationSeconds);
  const hasTriggeredTimeoutRef = useRef(false);
  const intervalRef = useRef(null);
  const finalTimeSpentRef = useRef(0);

  // Keep totalDurationRef in sync
  useEffect(() => {
    totalDurationRef.current = totalDurationSeconds;
  }, [totalDurationSeconds]);

  // Main countdown effect
  useEffect(() => {
    if (!isRunning || totalDurationSeconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const tick = () => {
      if (!startTimeRef.current || hasTriggeredTimeoutRef.current) return;

      const elapsedMs = Date.now() - startTimeRef.current;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const remaining = Math.max(0, totalDurationRef.current - elapsedSeconds);

      setTimeLeft(remaining);
      finalTimeSpentRef.current = Math.min(elapsedSeconds, totalDurationRef.current);

      // Warning when <= 10% remaining or less than 15s if short
      const warningThreshold = Math.max(10, Math.ceil(totalDurationRef.current * 0.1));
      setIsWarning(remaining > 0 && remaining <= warningThreshold);

      if (remaining <= 0) {
        if (!hasTriggeredTimeoutRef.current) {
          hasTriggeredTimeoutRef.current = true;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (typeof onTimeout === 'function') {
            onTimeout();
          }
        }
      }
    };

    // Run tick immediately and set frequent interval to prevent UI jitter
    tick();
    intervalRef.current = setInterval(tick, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, totalDurationSeconds, onTimeout]);

  /**
   * Immediately stops the timer and returns the final time spent.
   */
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    hasTriggeredTimeoutRef.current = true;
    
    if (startTimeRef.current) {
      const elapsed = Math.min(
        totalDurationRef.current,
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      );
      finalTimeSpentRef.current = elapsed;
      return elapsed;
    }
    return finalTimeSpentRef.current;
  }, []);

  const timeSpent = startTimeRef.current
    ? Math.min(totalDurationRef.current, Math.max(0, totalDurationRef.current - timeLeft))
    : 0;

  return {
    timeLeft,
    timeSpent: finalTimeSpentRef.current || timeSpent,
    isWarning,
    stopTimer,
  };
}
