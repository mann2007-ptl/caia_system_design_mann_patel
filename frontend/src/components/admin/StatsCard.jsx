import React from 'react';

const StatsCard = ({ title, value, icon, trend, bgColor, textColor }) => {
    // If color is passed or we extract from text-color
    const color = textColor?.replace('text-', '').replace('-600', '') || 'blue';
    const hexColor = {
        blue: '#3B82F6', indigo: '#6366F1', purple: '#8B5CF6', 
        emerald: '#10B981', slate: '#64748B', cyan: '#06B6D4', 
        amber: '#F59E0B', rose: '#F43F5E'
    }[color] || '#6366F1';
    const bgHex = hexColor + '15'; // 15% opacity for background

    return (
        <div className="stats-card group">
            <div className="stats-card-icon" style={{ background: bgHex, color: hexColor }}>
                {icon}
            </div>
            <div className="stats-card-info flex-1">
                <span className="stats-card-label">{title}</span>
                <div className="stats-card-value">{value}</div>
                {trend !== undefined && (
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: trend >= 0 ? '#10B981' : '#F43F5E', fontWeight: '500' }}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;

