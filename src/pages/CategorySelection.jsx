import React, { useState } from 'react';
import { Search, Grid, ArrowLeft, Trophy } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import { CATEGORIES } from '../data/categories';

export default function CategorySelection({ onSelectCategory, onBack, stats }) {
  const [searchTerm, setSearchTerm] = useState('');
  const categoryBests = stats?.categoryBests || {};

  const filteredCategories = CATEGORIES.filter((cat) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      cat.name.toLowerCase().includes(term) ||
      cat.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="categories-page-container">
      {/* Top Header Row */}
      <div className="page-header-row">
        <button
          className="btn-back"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search categories (e.g., Science, Code)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search categories"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="categories-header-intro">
        <h1 className="page-main-title">Select a Quiz Category</h1>
        <p className="page-main-desc">
          Choose a subject to test your knowledge. Each category offers 15 curated questions across Easy, Medium, and Hard difficulty levels.
        </p>
      </div>

      {/* Grid of categories */}
      {filteredCategories.length === 0 ? (
        <div className="empty-search-state">
          <Grid size={40} className="empty-icon" />
          <h3>No Categories Found</h3>
          <p>No quiz categories matched your search term "{searchTerm}". Try a different keyword.</p>
          <button className="btn btn-secondary" onClick={() => setSearchTerm('')}>
            View All Categories
          </button>
        </div>
      ) : (
        <div className="categories-grid">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              bestScore={categoryBests[cat.id]}
              onSelect={onSelectCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
