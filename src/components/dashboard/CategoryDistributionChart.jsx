import React from 'react';
import { Layers, PieChart } from 'lucide-react';

export function CategoryDistributionChart({ books = [], categories = [] }) {
  const totalBooks = books.length;

  // Compute count per category from actual state
  const categoryStats = categories.map((cat, index) => {
    const count = books.filter((b) => (b.category || 'General') === cat).length;
    const percentage = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;

    // Palette variants
    const colors = [
      { from: '#0ea5e9', to: '#38bdf8' }, // Electric Blue
      { from: '#8b5cf6', to: '#a855f7' }, // Purple
      { from: '#10b981', to: '#34d399' }, // Emerald
      { from: '#f59e0b', to: '#fbbf24' }, // Amber
      { from: '#ec4899', to: '#f472b6' }, // Rose / Pink
      { from: '#6366f1', to: '#818cf8' }, // Indigo
    ];

    const color = colors[index % colors.length];

    return {
      name: cat,
      count,
      percentage,
      color
    };
  });

  return (
    <div className="glass-card category-chart-card">
      <div className="card-header-flex">
        <div>
          <h3 className="section-title">Book Category Distribution</h3>
          <p className="section-desc">Inventory balance across disciplines & genres</p>
        </div>
        <div className="category-count-badge">
          <Layers size={14} />
          <span>{categories.length} Categories</span>
        </div>
      </div>

      <div className="category-bars-list">
        {categoryStats.map((item) => (
          <div key={item.name} className="category-bar-item">
            <div className="bar-header">
              <span className="bar-category-name">{item.name}</span>
              <div className="bar-counts">
                <span className="bar-count-number">{item.count} titles</span>
                <span className="bar-percentage">{item.percentage}%</span>
              </div>
            </div>

            <div className="bar-track">
              <div 
                className="bar-fill"
                style={{ 
                  width: `${Math.max(item.percentage, 4)}%`,
                  background: `linear-gradient(90deg, ${item.color.from}, ${item.color.to})`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryDistributionChart;

