import React, { useState } from 'react';
import { Sparkles, Trophy, Home, Grid, BarChart3, Menu, X } from 'lucide-react';

export default function Navbar({ currentView, onNavigate, stats }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bestPercentage = stats?.overallBestPercentage || 0;
  const totalAttempts = stats?.totalAttempts || 0;

  const handleNav = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <button
          className="brand-logo"
          onClick={() => handleNav('home')}
          aria-label="QuizMaster Home"
        >
          <div className="brand-icon-box">
            <Sparkles size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">QuizMaster</span>
            <span className="brand-tag">Interactive Quiz</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <button
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            className={`nav-link ${currentView === 'categories' || currentView === 'configure' ? 'active' : ''}`}
            onClick={() => handleNav('categories')}
          >
            <Grid size={18} />
            <span>Categories</span>
          </button>

          <button
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            <BarChart3 size={18} />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Header Right Stats Pill */}
        <div className="header-actions">
          {totalAttempts > 0 ? (
            <button
              className="best-score-pill"
              onClick={() => handleNav('dashboard')}
              title="View your best score on the Dashboard"
            >
              <Trophy size={16} className="trophy-icon" />
              <span className="pill-label">Best:</span>
              <span className="pill-value">{bestPercentage}%</span>
            </button>
          ) : (
            <button
              className="header-cta-btn"
              onClick={() => handleNav('categories')}
            >
              Start Quiz
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            className={`mobile-nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button
            className={`mobile-nav-link ${currentView === 'categories' ? 'active' : ''}`}
            onClick={() => handleNav('categories')}
          >
            <Grid size={20} />
            <span>Categories</span>
          </button>
          <button
            className={`mobile-nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            <BarChart3 size={20} />
            <span>Dashboard & Scores</span>
          </button>
        </div>
      )}
    </header>
  );
}
