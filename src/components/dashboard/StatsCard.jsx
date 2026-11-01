import React from 'react';

export function StatsCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  accent = 'blue', 
  trend,
  onClick
}) {
  return (
    <div 
      className={`stat-card glass-card stat-accent-${accent} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className={`stat-icon-wrapper accent-${accent}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-value-row">
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend-pill ${trend.type || 'positive'}`}>
            {trend.text}
          </span>
        )}
      </div>

      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  );
}

export default StatsCard;
