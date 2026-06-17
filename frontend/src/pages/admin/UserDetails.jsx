import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getUserById } from '../../features/admin/adminSlice';
import PageHeader from '../../components/admin/PageHeader';
import StatsCard from '../../components/admin/StatsCard';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import { FiBookmark, FiArchive, FiEye, FiArrowLeft, FiClock } from 'react-icons/fi';

const UserDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, loading } = useSelector(state => state.admin);

    useEffect(() => {
        if (id) {
            dispatch(getUserById(id));
        }
    }, [dispatch, id]);

    if (loading || !currentUser) {
        return (
            <div className="dash-page fade-in max-w-5xl mx-auto">
                <PageHeader title="User Details" />
                <LoadingSkeleton type="card" />
            </div>
        );
    }

    return (
        <div className="dash-page fade-in max-w-5xl mx-auto">
            <Helmet>
                <title>{currentUser.name} — User Details</title>
            </Helmet>
            
            <PageHeader 
                title="User Profile" 
                breadcrumbs={[
                    { label: 'Admin', path: '/admin/dashboard' }, 
                    { label: 'Users', path: '/admin/users' },
                    { label: currentUser.name }
                ]}
                actionButton={
                    <button 
                        onClick={() => navigate(-1)}
                        className="admin-action-secondary"
                    >
                        <FiArrowLeft /> Back
                    </button>
                }
            />

            <div className="dash-section" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
                <div className="admin-card text-center flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-3xl shadow-md mb-4">
                        {currentUser.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
                    <p className="text-slate-500 mb-4">{currentUser.email}</p>
                    
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-6 ${currentUser.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                        {currentUser.role === 'admin' ? 'Administrator' : 'Standard User'}
                    </span>

                    <div className="w-full border-t border-slate-100 pt-4 mt-2 flex flex-col gap-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Joined</span>
                            <span className="font-medium text-slate-800">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Status</span>
                            <span className={`font-medium ${currentUser.isBanned ? 'text-red-600' : 'text-emerald-600'}`}>
                                {currentUser.isBanned ? 'Deactivated' : 'Active'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Last Login</span>
                            <span className="font-medium text-slate-800">2 days ago</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="dash-stats-grid mb-6">
                        <StatsCard title="Bookmarks" value={currentUser.bookmarks?.length || 0} icon={<FiBookmark size={20} />} textColor="text-emerald-600" />
                        <StatsCard title="Archived" value="0" icon={<FiArchive size={20} />} textColor="text-amber-600" />
                        <StatsCard title="Concepts Viewed" value="142" icon={<FiEye size={20} />} textColor="text-blue-600" />
                    </div>

                    <div className="admin-card overflow-hidden" style={{ padding: 0 }}>
                        <div className="admin-card-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-mist)' }}>
                            <h3 className="admin-card-title">Recent Activity</h3>
                        </div>
                        <div>
                            {[1, 2, 3, 4, 5].map((item, index) => (
                                <div key={item} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors" style={{ borderTop: index !== 0 ? '1px solid var(--color-mist)' : 'none' }}>
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <FiClock />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-800 font-medium">Viewed <span className="text-blue-600">Event Loop Architecture</span></p>
                                        <p className="text-xs text-slate-500 mt-1">{item} hour{item > 1 ? 's' : ''} ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;

