import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategorySelection from './pages/CategorySelection';
import QuizConfiguration from './pages/QuizConfiguration';
import QuizScreen from './pages/QuizScreen';
import ResultsPage from './pages/ResultsPage';
import PerformanceDashboard from './pages/PerformanceDashboard';

import { CATEGORIES } from './data/categories';
import { QUESTIONS } from './data/questions';
import { prepareQuizQuestions } from './utils/shuffle';
import { calculateQuizResults } from './utils/scoring';
import {
  getStats,
  getHistory,
  recordQuizAttempt,
  saveLastConfig,
  getLastConfig,
  clearAllHistory,
} from './utils/storage';

export default function App() {
  // Views: 'home' | 'categories' | 'configure' | 'quiz' | 'results' | 'dashboard'
  const [currentView, setCurrentView] = useState('home');

  // Persistence state
  const [stats, setStats] = useState(() => getStats());
  const [history, setHistory] = useState(() => getHistory());

  // Active quiz setup state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeQuizConfig, setActiveQuizConfig] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [isNewBestScore, setIsNewBestScore] = useState(false);

  // Sync storage on mount
  useEffect(() => {
    setStats(getStats());
    setHistory(getHistory());
  }, []);

  // Handlers for navigation
  const handleNavigate = (view) => {
    // If navigating away from an unfinished quiz, reset question state
    if (currentView === 'quiz') {
      const confirmExit = window.confirm('Are you sure you want to leave the active quiz? Your current progress will be lost.');
      if (!confirmExit) return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User selects a category to configure
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView('configure');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User starts quiz with chosen configuration
  const handleStartQuiz = (config) => {
    saveLastConfig(config);
    setActiveQuizConfig(config);

    // Get all questions for this category
    const categoryQuestions = QUESTIONS.filter((q) => q.category === config.categoryId);

    // Prepare shuffled questions & randomized options
    const prepared = prepareQuizQuestions(
      categoryQuestions,
      config.questionCount,
      config.difficulty
    );

    setActiveQuestions(prepared);
    setQuizResults(null);
    setIsNewBestScore(false);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User submits or timer expires
  const handleSubmitQuiz = useCallback(
    ({ answers, timeSpentSeconds, submissionType }) => {
      // Calculate pure scoring
      const results = calculateQuizResults(
        activeQuestions,
        answers,
        timeSpentSeconds,
        submissionType
      );

      // Persist to storage
      const { updatedStats, updatedHistory, isNewBest } = recordQuizAttempt({
        categoryId: activeQuizConfig.categoryId,
        categoryName: activeQuizConfig.categoryName,
        difficulty: activeQuizConfig.difficulty,
        score: results.score,
        totalQuestions: results.totalQuestions,
        percentage: results.percentage,
        accuracy: results.accuracy,
        timeSpentSeconds: results.timeSpentSeconds,
        submissionType: results.submissionType,
      });

      setStats(updatedStats);
      setHistory(updatedHistory);
      setIsNewBestScore(isNewBest);
      setQuizResults(results);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activeQuestions, activeQuizConfig]
  );

  // User wants to retry the same quiz configuration
  const handleRetryQuiz = () => {
    if (activeQuizConfig && selectedCategory) {
      handleStartQuiz(activeQuizConfig);
    } else {
      setCurrentView('categories');
    }
  };

  // User clears history
  const handleClearHistory = () => {
    const { stats: freshStats, history: freshHistory } = clearAllHistory();
    setStats(freshStats);
    setHistory(freshHistory);
  };

  return (
    <div className="app-root">
      {/* Navbar rendered except during intense active quiz mode */}
      {currentView !== 'quiz' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          stats={stats}
        />
      )}

      <main className="app-main-content">
        {currentView === 'home' && (
          <HomePage
            onSelectCategory={handleSelectCategory}
            onNavigate={handleNavigate}
            stats={stats}
          />
        )}

        {currentView === 'categories' && (
          <CategorySelection
            onSelectCategory={handleSelectCategory}
            onBack={() => handleNavigate('home')}
            stats={stats}
          />
        )}

        {currentView === 'configure' && selectedCategory && (
          <QuizConfiguration
            category={selectedCategory}
            onBack={() => setCurrentView('categories')}
            onStartQuiz={handleStartQuiz}
            initialConfig={getLastConfig()}
          />
        )}

        {currentView === 'quiz' && (
          <QuizScreen
            questions={activeQuestions}
            categoryName={activeQuizConfig?.categoryName || 'Quiz'}
            totalDurationSeconds={activeQuizConfig?.totalDurationSeconds || 300}
            onSubmitQuiz={handleSubmitQuiz}
            onExitQuiz={() => handleNavigate('categories')}
          />
        )}

        {currentView === 'results' && quizResults && (
          <ResultsPage
            results={quizResults}
            quizConfig={activeQuizConfig}
            isNewBest={isNewBestScore}
            onRetryQuiz={handleRetryQuiz}
            onChooseCategory={() => setCurrentView('categories')}
            onGoHome={() => handleNavigate('home')}
            onGoDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <PerformanceDashboard
            stats={stats}
            history={history}
            onClearHistory={handleClearHistory}
            onStartCategory={(cat) => {
              if (cat) {
                handleSelectCategory(cat);
              } else {
                setCurrentView('categories');
              }
            }}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'quiz' && (
        <footer className="app-footer">
          <div className="footer-inner">
            <div className="footer-left">
              <strong>QuizMaster</strong> — Production-Quality Interactive Quiz Platform.
            </div>
            <div className="footer-right">
              <span>8 Categories</span> • <span>120+ Curated Questions</span> • <span>Zero External Dependencies</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
