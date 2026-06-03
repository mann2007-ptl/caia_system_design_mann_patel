import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineBookOpen, HiOutlineBookmarkSquare, HiOutlineArchiveBox,
    HiOutlinePencilSquare, HiOutlineArrowRight, HiOutlineSparkles,
    HiOutlineBolt, HiOutlineEye
} from 'react-icons/hi2';
import { StatsCard, SkeletonCard, DifficultyBadge } from '../../components/dashboard/DashboardComponents';
import { fetchDashboardStats, fetchConcepts } from '../../features/concepts/conceptSlice';

const DIFFICULTY_COLORS = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' };

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { dashboardStats, statsLoading, items, loading } = useSelector((state) => state.concepts);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchConcepts({ page: 1, limit: 6 }));
    }, [dispatch]);

    const quickActions = [
        { label: 'Explore Concepts', icon: HiOutlineBookOpen, path: '/concepts', color: '#4F46E5', bg: '#EEF2FF' },
        { label: 'My Bookmarks', icon: HiOutlineBookmarkSquare, path: '/bookmarks', color: '#06B6D4', bg: '#ECFEFF' },
        { label: 'Random Concept', icon: HiOutlineSparkles, path: '/concepts', color: '#F59E0B', bg: '#FFFBEB' },
    ];

    return (
        <>
            <Helmet>
                <title>Dashboard — CAIA Platform</title>
                <meta name="description" content="Your CAIA learning dashboard with system design concepts overview." />
            </Helmet>

            <div className="dash-page fade-in">
                {/* Welcome */}
                <div className="dash-welcome">
                    <div className="dash-welcome-text">
                        <h1>Welcome back, {user?.name || 'Learner'} <span className="wave">👋</span></h1>
                        <p>Track your system design learning progress and explore new concepts.</p>
                    </div>
                    <div className="dash-welcome-icon">
                        <HiOutlineBolt />
                    </div>
                </div>

                {/* Stats */}
                <div className="dash-stats-grid">
                    <StatsCard icon={HiOutlineBookOpen} label="Total Concepts" value={dashboardStats.totalConcepts} color="#4F46E5" loading={statsLoading} />
                    <StatsCard icon={HiOutlineBookmarkSquare} label="Bookmarked" value={dashboardStats.totalBookmarks} color="#06B6D4" loading={statsLoading} />
                    <StatsCard icon={HiOutlineArchiveBox} label="Archived" value={dashboardStats.totalArchived} color="#F59E0B" loading={statsLoading} />
                    <StatsCard icon={HiOutlinePencilSquare} label="Notes Added" value={dashboardStats.totalNotes} color="#10B981" loading={statsLoading} />
                </div>

                {/* Quick Actions */}
                <div className="dash-section">
                    <h2 className="dash-section-title">Quick Actions</h2>
                    <div className="dash-quick-actions">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                className="quick-action-card"
                                onClick={() => navigate(action.path)}
                            >
                                <div className="quick-action-icon" style={{ background: action.bg, color: action.color }}>
                                    <action.icon />
                                </div>
                                <span className="quick-action-label">{action.label}</span>
                                <HiOutlineArrowRight className="quick-action-arrow" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Concepts */}
                <div className="dash-section">
                    <div className="dash-section-header">
                        <h2 className="dash-section-title">Recent Concepts</h2>
                        <button className="dash-view-all" onClick={() => navigate('/concepts')}>View all</button>
                    </div>
                    <div className="dash-recent-list">
                        {(loading || statsLoading) ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="recent-concept-item" style={{ minHeight: '72px' }}>
                                    <div className="recent-concept-info">
                                        <div className="skeleton-line" style={{ height: '16px', width: '70%', marginBottom: '0.4rem' }} />
                                        <div className="skeleton-line" style={{ height: '12px', width: '40%' }} />
                                    </div>
                                </div>
                            ))
                        ) : items.length > 0 ? (
                            items.slice(0, 6).map((concept) => {
                                const meta = concept.metadata || {};
                                const title = meta.concept || concept.prompt?.slice(0, 60) || 'System Design Concept';
                                const category = meta.category || 'System Design';
                                const difficulty = meta.difficulty || '';
                                return (
                                    <div
                                        key={concept._id}
                                        className="recent-concept-item"
                                        onClick={() => navigate(`/concepts/${concept._id}`)}
                                    >
                                        <div className="recent-concept-info">
                                            <span className="recent-concept-name">{title}</span>
                                            <span className="recent-concept-category">
                                                {category}
                                                {meta.subcategory ? ` › ${meta.subcategory}` : ''}
                                            </span>
                                        </div>
                                        <div className="recent-concept-right">
                                            {difficulty && (
                                                <span
                                                    className="recent-concept-difficulty"
                                                    style={{ color: DIFFICULTY_COLORS[difficulty] || '#6366f1' }}
                                                >
                                                    {difficulty}
                                                </span>
                                            )}
                                            <span className="recent-concept-views">
                                                <HiOutlineEye /> {concept.views || 0}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <div className="empty-state-icon"><HiOutlineBookOpen /></div>
                                <h3 className="empty-state-title">No concepts yet</h3>
                                <p className="empty-state-message">Start exploring system design concepts to see them here.</p>
                                <button className="empty-state-btn" onClick={() => navigate('/concepts')}>
                                    Explore Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
