import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiOutlineArrowRightOnRectangle, HiOutlineShieldCheck } from 'react-icons/hi2';
import { logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
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
                <title>Admin Dashboard — CAIA Platform</title>
            </Helmet>

            <div className="dashboard-page">
                <div style={{ marginBottom: '1rem' }}>
                    <HiOutlineShieldCheck style={{ fontSize: '3rem', color: '#6366f1' }} />
                </div>
                <h1 className="dashboard-title">Admin Panel</h1>
                <p className="dashboard-subtitle">
                    Welcome back, {user?.name || 'Admin'}. Your admin dashboard is under construction.
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

export default AdminDashboard;
