import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/admin/PageHeader';
import StatsCard from '../../components/admin/StatsCard';
import { FiBookmark, FiTrendingUp, FiStar } from 'react-icons/fi';

const BookmarkAnalytics = () => {
    // Mock data for analytics
    const topBookmarked = [
        { id: 1, title: 'Database Sharding Strategies', category: 'System Design', count: 428 },
        { id: 2, title: 'Event Loop in Node.js', category: 'Backend Engineering', count: 356 },
        { id: 3, title: 'CAP Theorem Explained', category: 'System Design', count: 312 },
        { id: 4, title: 'Consistent Hashing', category: 'Architecture', count: 289 },
        { id: 5, title: 'Microservices vs Monolith', category: 'Architecture', count: 245 },
    ];

    const topCategories = [
        { name: 'System Design', percentage: 45, color: 'bg-blue-500' },
        { name: 'Backend Engineering', percentage: 30, color: 'bg-emerald-500' },
        { name: 'Architecture', percentage: 15, color: 'bg-purple-500' },
        { name: 'Database', percentage: 10, color: 'bg-amber-500' },
    ];

    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>Bookmark Analytics — CAIA Admin</title>
            </Helmet>
            
            <PageHeader 
                title="Bookmark Analytics" 
                description="Gain insights into what content users are saving the most."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Bookmarks' }]}
            />

            <div className="dash-stats-grid">
                <StatsCard title="Total Bookmarks" value="12,450" icon={<FiBookmark size={24} />} trend={15} />
                <StatsCard title="Avg. Bookmarks/User" value="8.4" icon={<FiTrendingUp size={24} />} trend={5} textColor="text-emerald-600" />
                <StatsCard title="Most Popular Category" value="System Design" icon={<FiStar size={24} />} textColor="text-amber-600" />
            </div>

            <div className="dash-section">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">
                                <FiBookmark className="text-blue-600" /> Most Bookmarked Concepts
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {topBookmarked.map((item, index) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">
                                        <FiBookmark size={14} /> {item.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Top Categories by Bookmarks</h3>
                        </div>
                        <div className="space-y-6">
                            {topCategories.map((cat, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-slate-700">{cat.name}</span>
                                        <span className="text-slate-500">{cat.percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${cat.color} rounded-full`} 
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800 mb-4">Bookmark Trends</h4>
                            <div className="h-32 flex items-end justify-between gap-1">
                                {[20, 35, 25, 45, 40, 60, 55, 75, 70, 90, 85, 100].map((h, i) => (
                                    <div key={i} className="w-full bg-blue-100 hover:bg-blue-500 rounded-t-sm transition-colors" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookmarkAnalytics;

