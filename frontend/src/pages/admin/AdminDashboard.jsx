import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineUsers, HiOutlineDocumentText, HiOutlineChartBar,
    HiOutlineShieldCheck, HiOutlineNoSymbol, HiOutlineCheckCircle,
    HiOutlineTrash
} from 'react-icons/hi2';
import { StatsCard, SkeletonRow, Badge } from '../../components/dashboard/DashboardComponents';
import { fetchAllUsers, updateUserRole, banUser, unbanUser, fetchAdminAnalytics } from '../../features/admin/adminSlice';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { users, userLoading, analytics, analyticsLoading } = useSelector((state) => state.admin);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAdminAnalytics());
    }, [dispatch]);

    const handleRoleChange = (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        dispatch(updateUserRole({ id, role: newRole }));
        toast.success(`Role updated to ${newRole}`);
    };

    const handleBanToggle = (id, isBanned) => {
        if (isBanned) {
            dispatch(unbanUser(id));
            toast.success('User unbanned');
        } else {
            dispatch(banUser(id));
            toast.success('User banned');
        }
    };

    const OverviewTab = () => (
        <div className="admin-tab-content fade-in">
            <h2 className="admin-section-title">Platform Overview</h2>
            <div className="dash-stats-grid mb-6">
                <StatsCard icon={HiOutlineUsers} label="Total Users" value={users.length} color="#4F46E5" loading={userLoading} />
                <StatsCard icon={HiOutlineDocumentText} label="Total Activity" value="Active" color="#10B981" loading={false} />
            </div>

            <div className="admin-analytics-grid">
                {/* CSS Based Bar Chart for Difficulty */}
                <div className="admin-analytics-card">
                    <h3 className="analytics-title">Difficulty Distribution</h3>
                    <div className="css-chart-container">
                        {analyticsLoading ? <div className="spinner spinner-indigo" /> : (
                            analytics.difficultyStats?.map((stat, i) => {
                                const max = Math.max(...analytics.difficultyStats.map(s => s.count || 0), 1);
                                const height = `${(stat.count / max) * 100}%`;
                                return (
                                    <div key={i} className="css-bar-wrapper">
                                        <div className="css-bar" style={{ height, background: '#4F46E5' }}>
                                            <span className="css-bar-tooltip">{stat.count} {stat._id}</span>
                                        </div>
                                        <span className="css-bar-label">{stat._id}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* CSS Based Progress Bars for Languages */}
                <div className="admin-analytics-card">
                    <h3 className="analytics-title">Top Languages</h3>
                    <div className="css-progress-list">
                        {analyticsLoading ? <div className="spinner spinner-indigo" /> : (
                            analytics.topLanguages?.map((lang, i) => {
                                const max = Math.max(...analytics.topLanguages.map(l => l.count || 0), 1);
                                const width = `${(lang.count / max) * 100}%`;
                                return (
                                    <div key={i} className="css-progress-item">
                                        <div className="css-progress-header">
                                            <span>{lang._id}</span>
                                            <span>{lang.count} concepts</span>
                                        </div>
                                        <div className="css-progress-track">
                                            <div className="css-progress-fill" style={{ width, background: '#06B6D4' }} />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const UsersTab = () => (
        <div className="admin-tab-content fade-in">
            <h2 className="admin-section-title">User Management</h2>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan="6"><SkeletonRow /></td></tr>
                            ))
                        ) : users.length > 0 ? (
                            users.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        <div className="user-name-cell">
                                            <div className="user-avatar-mini">{u.name?.charAt(0).toUpperCase()}</div>
                                            <span>{u.name}</span>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <Badge variant={u.role === 'admin' ? 'primary' : 'default'}>{u.role}</Badge>
                                    </td>
                                    <td>
                                        <Badge variant={u.isBanned ? 'danger' : 'success'}>{u.isBanned ? 'Banned' : 'Active'}</Badge>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button
                                                className="table-action-btn"
                                                onClick={() => handleRoleChange(u._id, u.role)}
                                                title={`Make ${u.role === 'admin' ? 'User' : 'Admin'}`}
                                            >
                                                <HiOutlineShieldCheck />
                                            </button>
                                            <button
                                                className={`table-action-btn ${u.isBanned ? 'success' : 'danger'}`}
                                                onClick={() => handleBanToggle(u._id, u.isBanned)}
                                                title={u.isBanned ? 'Unban' : 'Ban'}
                                            >
                                                {u.isBanned ? <HiOutlineCheckCircle /> : <HiOutlineNoSymbol />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="table-empty">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Admin Panel — CAIA Platform</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page">
                <div className="page-header">
                    <h1 className="page-title">Admin Control Panel</h1>
                    <p className="page-subtitle">Manage users, content, and view system analytics.</p>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <HiOutlineChartBar /> Overview & Analytics
                    </button>
                    <button
                        className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <HiOutlineUsers /> User Management
                    </button>
                </div>

                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'users' && <UsersTab />}
            </div>
        </>
    );
};

export default AdminDashboard;
