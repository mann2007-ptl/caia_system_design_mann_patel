import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getDashboardStats } from '../../features/admin/adminSlice';
import PageHeader from '../../components/admin/PageHeader';
import StatsCard from '../../components/admin/StatsCard';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import { 
    FiBookOpen, FiUsers, FiGrid, FiBookmark, 
    FiArchive, FiEye, FiThumbsUp, FiActivity 
} from 'react-icons/fi';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);

    // Mock data if stats not available yet, blending real data if present
    const dashboardStats = [
        { title: 'Total Concepts', value: stats?.totalConcepts || '950+', icon: <FiBookOpen size={24} />, trend: 12, textColor: 'text-blue-600' },
        { title: 'Total Users', value: '1,240', icon: <FiUsers size={24} />, trend: 8, textColor: 'text-indigo-600' },
        { title: 'Total Categories', value: stats?.categoryDistribution?.length || 15, icon: <FiGrid size={24} />, textColor: 'text-purple-600' },
        { title: 'Total Bookmarks', value: '3,420', icon: <FiBookmark size={24} />, trend: 24, textColor: 'text-emerald-600' },
        { title: 'Archived Concepts', value: '42', icon: <FiArchive size={24} />, textColor: 'text-slate-600' },
        { title: 'Total Views', value: '45.2k', icon: <FiEye size={24} />, trend: 18, textColor: 'text-cyan-600' },
        { title: 'Total Votes', value: '12.8k', icon: <FiThumbsUp size={24} />, trend: 5, textColor: 'text-amber-600' },
        { title: 'Active Users', value: '320', icon: <FiActivity size={24} />, trend: -2, textColor: 'text-rose-600' },
    ];

    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>Admin Dashboard — CAIA</title>
            </Helmet>
            <PageHeader 
                title="Dashboard Overview" 
                description="Welcome to the CAIA Admin Dashboard. Here's what's happening with your platform today."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Dashboard' }]}
            />

            {loading ? (
                <div className="dash-stats-grid">
                    {[...Array(8)].map((_, i) => <LoadingSkeleton key={i} type="card" />)}
                </div>
            ) : (
                <div className="dash-stats-grid">
                    {dashboardStats.map((stat, i) => (
                        <StatsCard key={i} {...stat} />
                    ))}
                </div>
            )}

            <div className="dash-section">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    {/* Line Chart Placeholder */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">User Growth & Engagement</h3>
                        </div>
                        {loading ? <LoadingSkeleton type="chart" /> : (
                            <div className="h-80 flex items-end justify-between gap-2 relative">
                                {/* Decorative mock chart */}
                                <div className="absolute inset-0 border-b border-l border-slate-100"></div>
                                {[40, 55, 45, 70, 65, 85, 80, 95, 90, 110, 105, 120].map((h, i) => (
                                    <div key={i} className="w-full bg-gradient-to-t from-blue-100 to-blue-500 rounded-t-sm relative z-10 hover:opacity-80 transition-opacity cursor-pointer group" style={{ height: `${(h/120)*100}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {h}k
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Distribution Placeholder */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Category Distribution</h3>
                        </div>
                        {loading ? <LoadingSkeleton type="chart" /> : (
                            <div className="flex flex-col items-center justify-center h-80 relative gap-8">
                                <div className="w-48 h-48 rounded-full border-[16px] border-slate-50 relative shadow-inner">
                                    <div className="absolute inset-0 border-[16px] border-blue-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0)' }}></div>
                                    <div className="absolute inset-0 border-[16px] border-emerald-400 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%, 50% 50%)' }}></div>
                                    <div className="absolute inset-0 border-[16px] border-amber-400 rounded-full" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 50% 50%)', transform: 'rotate(45deg)' }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col bg-white m-2 rounded-full shadow-sm">
                                        <span className="text-3xl font-bold text-slate-800">{stats?.categoryDistribution?.length || 15}</span>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Categories</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm font-medium text-slate-600">
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Backend</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> System Design</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Architecture</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

