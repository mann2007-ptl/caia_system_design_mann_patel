import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/admin/PageHeader';
import { FiDownload, FiBarChart2, FiPieChart, FiUsers, FiThumbsUp } from 'react-icons/fi';

const Reports = () => {
    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>Reports — CAIA Admin</title>
            </Helmet>
            <PageHeader 
                title="System Reports" 
                description="Exportable analytics and engagement reports."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }]}
                actionButton={
                    <button className="admin-action-secondary">
                        <FiDownload /> Export All (CSV)
                    </button>
                }
            />

            <div className="dash-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Most Viewed Concepts */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">
                            <FiBarChart2 className="text-blue-600" /> Most Viewed Concepts
                        </h3>
                        <button className="admin-card-action">Export</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">System Architecture Patterns {i}</p>
                                    <p className="text-xs text-slate-500">System Design</p>
                                </div>
                                <div className="font-bold text-slate-700">{15000 - i * 1200} <span className="text-xs text-slate-400 font-normal">views</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Most Voted Concepts */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">
                            <FiThumbsUp className="text-emerald-600" /> Most Voted Concepts
                        </h3>
                        <button className="admin-card-action">Export</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">Database Sharding Explained {i}</p>
                                    <p className="text-xs text-slate-500">Database</p>
                                </div>
                                <div className="font-bold text-slate-700">{8000 - i * 500} <span className="text-xs text-slate-400 font-normal">votes</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">
                            <FiPieChart className="text-purple-600" /> Top Categories
                        </h3>
                        <button className="admin-card-action">Export</button>
                    </div>
                    <div className="space-y-4">
                        {['System Design', 'Backend Engineering', 'Architecture', 'Algorithms'].map((cat, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="font-semibold text-slate-800 text-sm">{cat}</span>
                                <div className="font-bold text-slate-700">{45 - i * 8}%</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Most Active Users */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">
                            <FiUsers className="text-amber-600" /> Most Active Users
                        </h3>
                        <button className="admin-card-action">Export</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">
                                        U{i}
                                    </div>
                                    <span className="font-semibold text-slate-800 text-sm">User Name {i}</span>
                                </div>
                                <div className="font-bold text-slate-700">{120 - i * 15} <span className="text-xs text-slate-400 font-normal">actions</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

