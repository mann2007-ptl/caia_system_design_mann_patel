import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineSquares2X2, HiOutlineBookOpen, HiOutlineBookmarkSquare,
    HiOutlineArchiveBox, HiOutlineUser, HiOutlineShieldCheck,
    HiOutlineArrowRightOnRectangle, HiOutlineBars3, HiOutlineXMark,
    HiOutlineBell, HiOutlineMagnifyingGlass
} from 'react-icons/hi2';
import { logout } from '../features/auth/authSlice';
import { ROLES } from '../constants';
import toast from 'react-hot-toast';

const navItems = [
    { to: '/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
    { to: '/concepts', icon: HiOutlineBookOpen, label: 'Concept Explorer' },
    { to: '/bookmarks', icon: HiOutlineBookmarkSquare, label: 'Bookmarks' },
    { to: '/archived', icon: HiOutlineArchiveBox, label: 'Archived' },
    { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, role } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Responsive: collapse sidebar on smaller screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
                setMobileOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login', { replace: true });
    };

    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            <Helmet>
                <title>CAIA Platform</title>
            </Helmet>
            <div className="dashboard-layout">
                {/* Mobile Overlay */}
                {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? 'expanded' : 'collapsed'} ${mobileOpen ? 'mobile-open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            <div className="logo-icon">C</div>
                            {sidebarOpen && <span className="logo-text">CAIA</span>}
                        </div>
                        <button className="sidebar-toggle desktop-only" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <HiOutlineBars3 />
                        </button>
                        <button className="sidebar-toggle mobile-only" onClick={closeMobile}>
                            <HiOutlineXMark />
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        {navItems.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                onClick={closeMobile}
                            >
                                <Icon className="sidebar-link-icon" />
                                {sidebarOpen && <span>{label}</span>}
                            </NavLink>
                        ))}

                        {role === ROLES.ADMIN && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) => `sidebar-link admin-link ${isActive ? 'active' : ''}`}
                                onClick={closeMobile}
                            >
                                <HiOutlineShieldCheck className="sidebar-link-icon" />
                                {sidebarOpen && <span>Admin Panel</span>}
                            </NavLink>
                        )}
                    </nav>

                    <div className="sidebar-footer">
                        <button className="sidebar-link logout-link" onClick={handleLogout}>
                            <HiOutlineArrowRightOnRectangle className="sidebar-link-icon" />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={`main-wrapper ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
                    {/* Top Navbar */}
                    <header className="top-navbar">
                        <div className="navbar-left">
                            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                                <HiOutlineBars3 />
                            </button>
                            <div className="navbar-search">
                                <HiOutlineMagnifyingGlass className="search-icon" />
                                <input type="text" placeholder="Search concepts..." className="search-input" />
                            </div>
                        </div>
                        <div className="navbar-right">
                            <button className="navbar-icon-btn">
                                <HiOutlineBell />
                            </button>
                            <span className="role-badge">{role || 'user'}</span>
                            <div className="navbar-avatar">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="page-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;
