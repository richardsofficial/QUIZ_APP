import React from 'react';
import {
  Sparkles,
  Trophy,
  Play,
  ArrowRight,
  Target,
  CheckCircle,
  Clock,
  Layers,
  BarChart2,
} from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import { CATEGORIES } from '../data/categories';

export default function HomePage({ onSelectCategory, onNavigate, stats }) {
  const totalAttempts = stats?.totalAttempts || 0;
  const bestPercentage = stats?.overallBestPercentage || 0;
  const categoryBests = stats?.categoryBests || {};

  // Count how many categories have been attempted
  const completedCategoriesCount = Object.keys(categoryBests).length;

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="hero-badge-icon" />
            <span>Interactive Quiz Platform</span>
          </div>

          <h1 className="hero-title">
            Challenge Your Knowledge, <span className="highlight-text">Master Every Subject</span>
          </h1>

          <p className="hero-description">
            Test your intellect across Science, Programming, History, Mathematics, and more.
            Compete against the clock, analyze comprehensive explanations, and track your performance over time.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary btn-large"
              onClick={() => onNavigate('categories')}
            >
              <Play size={18} />
              <span>Explore All Categories</span>
            </button>

            {totalAttempts > 0 && (
              <button
                className="btn btn-secondary btn-large"
                onClick={() => onNavigate('dashboard')}
              >
                <BarChart2 size={18} />
                <span>View Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Quick Stats Banner */}
        <div className="hero-stats-banner">
          <div className="hero-stat-card">
            <div className="hero-stat-icon-wrap stat-trophy">
              <Trophy size={22} />
            </div>
            <div className="hero-stat-info">
              <span className="hero-stat-val">{totalAttempts > 0 ? `${bestPercentage}%` : '--'}</span>
              <span className="hero-stat-label">Best Score</span>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="hero-stat-icon-wrap stat-target">
              <Target size={22} />
            </div>
            <div className="hero-stat-info">
              <span className="hero-stat-val">{totalAttempts}</span>
              <span className="hero-stat-label">Quizzes Completed</span>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="hero-stat-icon-wrap stat-layers">
              <Layers size={22} />
            </div>
            <div className="hero-stat-info">
              <span className="hero-stat-val">{completedCategoriesCount} / 8</span>
              <span className="hero-stat-label">Categories Mastered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="features-strip">
        <div className="feature-pill">
          <Clock size={18} className="feat-icon" />
          <span>Configurable Timers & Difficulty</span>
        </div>
        <div className="feature-pill">
          <CheckCircle size={18} className="feat-icon" />
          <span>Fisher-Yates Randomization</span>
        </div>
        <div className="feature-pill">
          <BarChart2 size={18} className="feat-icon" />
          <span>Local Storage Tracking</span>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="home-categories-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Popular Quiz Categories</h2>
            <p className="section-subtitle">
              Select any category to configure your question count, difficulty, and time limit.
            </p>
          </div>

          <button
            className="link-with-arrow"
            onClick={() => onNavigate('categories')}
          >
            <span>View All (8)</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="categories-grid">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              bestScore={categoryBests[cat.id]}
              onSelect={onSelectCategory}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
