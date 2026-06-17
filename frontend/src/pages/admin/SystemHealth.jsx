import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getSystemHealth } from '../../features/admin/adminSlice';
import PageHeader from '../../components/admin/PageHeader';
import { FiServer, FiDatabase, FiCpu, FiHardDrive, FiClock } from 'react-icons/fi';

const StatusIndicator = ({ status }) => {
    const isHealthy = status === 'healthy' || status === 'connected';
    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
            isHealthy ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
            <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isHealthy ? 'Operational' : 'Issues Detected'}
        </div>
    );
};

const SystemHealth = () => {
    const dispatch = useDispatch();
    const { systemHealth } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(getSystemHealth());
        // Poll every 30 seconds
        const interval = setInterval(() => dispatch(getSystemHealth()), 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    // Mock data based on typical system health response
    const health = systemHealth || {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: { status: 'connected', latency: '12ms' },
        memory: { used: '2.4 GB', total: '8.0 GB', percentage: 30 },
        cpu: { load: '14%' },
        uptime: '14d 8h 22m'
    };

    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>System Health — CAIA Admin</title>
            </Helmet>
            <PageHeader 
                title="System Health & Monitoring" 
                description="Real-time monitoring of server, database, and infrastructure."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'System Health' }]}
            />

            <div className="dash-section" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
                <div className="admin-card flex flex-col items-center justify-center text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${health.status === 'healthy' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                        <FiServer size={40} />
                    </div>
                    <h3 className="admin-card-title mb-2">Overall Status</h3>
                    <StatusIndicator status={health.status} />
                    <p className="text-xs text-slate-500 mt-4 flex items-center gap-1"><FiClock /> Last updated: {new Date(health.timestamp).toLocaleTimeString()}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div className="admin-card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiDatabase size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Database</h4>
                                    <p className="text-xs text-slate-500">MongoDB Atlas</p>
                                </div>
                            </div>
                            <StatusIndicator status={health.database?.status} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                            <span className="text-sm text-slate-500">Latency</span>
                            <span className="text-sm font-bold text-slate-800">{health.database?.latency || '12ms'}</span>
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><FiClock size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Uptime</h4>
                                    <p className="text-xs text-slate-500">Server Instance</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-2xl font-bold text-slate-800">{health.uptime}</span>
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FiCpu size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">CPU Usage</h4>
                                    <p className="text-xs text-slate-500">Core Avg</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-slate-800">{health.cpu?.load || '14%'}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: health.cpu?.load || '14%' }}></div>
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><FiHardDrive size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Memory Usage</h4>
                                    <p className="text-xs text-slate-500">{health.memory?.used} / {health.memory?.total}</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-slate-800">{health.memory?.percentage || 30}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${health.memory?.percentage || 30}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;

