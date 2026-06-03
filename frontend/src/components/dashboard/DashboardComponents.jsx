import { HiOutlineBookmarkSquare, HiOutlineArchiveBox, HiOutlineHandThumbUp, HiOutlineEye } from 'react-icons/hi2';
import { DIFFICULTY_COLORS } from '../../constants';

// ═══════════════════════════════════════════
//  STATS CARD
// ═══════════════════════════════════════════

export const StatsCard = ({ icon: Icon, label, value, color = '#4F46E5', loading }) => (
    <div className="stats-card">
        <div className="stats-card-icon" style={{ background: `${color}14`, color }}>
            {Icon && <Icon />}
        </div>
        <div className="stats-card-info">
            <span className="stats-card-value">{loading ? '—' : value}</span>
            <span className="stats-card-label">{label}</span>
        </div>
    </div>
);

// ═══════════════════════════════════════════
//  BADGE
// ═══════════════════════════════════════════

export const Badge = ({ children, variant = 'default', style = {} }) => {
    const colors = {
        default: { bg: '#f1f5f9', text: '#475569' },
        primary: { bg: '#eef2ff', text: '#4338ca' },
        success: { bg: '#dcfce7', text: '#166534' },
        warning: { bg: '#fef3c7', text: '#92400e' },
        danger: { bg: '#fee2e2', text: '#991b1b' },
        info: { bg: '#e0f2fe', text: '#075985' },
    };
    const c = colors[variant] || colors.default;
    return (
        <span className="badge" style={{ background: c.bg, color: c.text, ...style }}>
            {children}
        </span>
    );
};

export const DifficultyBadge = ({ difficulty }) => {
    const c = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.Easy;
    return <span className="badge" style={{ background: c.bg, color: c.text }}>{difficulty}</span>;
};

// ═══════════════════════════════════════════
//  EMPTY STATE
// ═══════════════════════════════════════════

export const EmptyState = ({ icon: Icon, title, message, action, onAction }) => (
    <div className="empty-state">
        {Icon && (
            <div className="empty-state-icon">
                <Icon />
            </div>
        )}
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
        {action && (
            <button className="empty-state-btn" onClick={onAction}>
                {action}
            </button>
        )}
    </div>
);

// ═══════════════════════════════════════════
//  SKELETON LOADER
// ═══════════════════════════════════════════

export const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-short" />
        <div className="skeleton-badges">
            <div className="skeleton-badge" />
            <div className="skeleton-badge" />
            <div className="skeleton-badge" />
        </div>
        <div className="skeleton-line skeleton-long" />
    </div>
);

export const SkeletonRow = () => (
    <div className="skeleton-row">
        <div className="skeleton-line skeleton-cell" />
        <div className="skeleton-line skeleton-cell" />
        <div className="skeleton-line skeleton-cell-short" />
    </div>
);

// ═══════════════════════════════════════════
//  PAGINATION
// ═══════════════════════════════════════════

export const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="pagination">
            <button className="pagination-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                Prev
            </button>
            {getPages().map((p) => (
                <button
                    key={p}
                    className={`pagination-btn ${p === page ? 'active' : ''}`}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}
            <button className="pagination-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                Next
            </button>
        </div>
    );
};

// ═══════════════════════════════════════════
//  NOTE MODAL
// ═══════════════════════════════════════════

import { useState } from 'react';

export const NoteModal = ({ isOpen, onClose, onSave, initialContent = '', loading }) => {
    const [content, setContent] = useState(initialContent);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Add Note</h3>
                <textarea
                    className="modal-textarea"
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                />
                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
                    <button
                        className="modal-btn save"
                        onClick={() => { onSave(content); setContent(''); }}
                        disabled={!content.trim() || loading}
                    >
                        {loading ? 'Saving...' : 'Save Note'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════
//  ACTION BUTTONS (for concept details)
// ═══════════════════════════════════════════

export const ActionButton = ({ icon: Icon, label, onClick, active, variant = 'default' }) => (
    <button
        className={`action-btn ${variant} ${active ? 'active' : ''}`}
        onClick={onClick}
        title={label}
    >
        <Icon />
        <span>{label}</span>
    </button>
);
