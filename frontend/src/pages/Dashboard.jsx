import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully.', {
            style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
        });
        navigate('/login', { replace: true });
    };

    return (
        <>
            <Helmet>
                <title>Dashboard — CAIA Platform</title>
            </Helmet>

            <div className="dashboard-page">
                <h1 className="dashboard-title">Welcome, {user?.name || 'User'} 👋</h1>
                <p className="dashboard-subtitle">
                    You're logged in to the CAIA Platform. Your dashboard is coming soon.
                </p>
                <button className="dashboard-logout-btn" onClick={handleLogout}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HiOutlineArrowRightOnRectangle />
                        Logout
                    </span>
                </button>
            </div>
        </>
    );
};

export default Dashboard;
