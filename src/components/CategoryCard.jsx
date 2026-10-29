import React from 'react';
import { ArrowRight, Trophy, Sparkles } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function CategoryCard({ category, bestScore, onSelect }) {
  return (
    <div
      className="category-card"
      onClick={() => onSelect(category)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(category);
        }
      }}
      aria-label={`Select category ${category.name}`}
    >
      <div className="card-top-row">
        <div
          className="cat-icon-container"
          style={{
            backgroundColor: category.badgeBg || '#eef2ff',
            color: category.accentColor || '#6366f1',
          }}
        >
          <CategoryIcon name={category.iconName} size={24} />
        </div>

        {bestScore ? (
          <div className="category-best-badge" title="Your highest score in this category">
            <Trophy size={14} className="trophy-gold" />
            <span>{bestScore.percentage}% Best</span>
          </div>
        ) : (
          <span className="category-tag-new">
            <Sparkles size={12} />
            <span>Ready</span>
          </span>
        )}
      </div>

      <div className="cat-card-body">
        <h3 className="cat-title">{category.name}</h3>
        <p className="cat-desc">{category.description}</p>
      </div>

      <div className="cat-card-footer">
        <div className="cat-stats-row">
          <span className="cat-stat-pill">15 Questions</span>
          <span className="cat-stat-pill diff-mixed">Easy - Hard</span>
        </div>

        <button
          type="button"
          className="cat-select-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(category);
          }}
          aria-label={`Start ${category.name} quiz`}
        >
          <span>Start Quiz</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
