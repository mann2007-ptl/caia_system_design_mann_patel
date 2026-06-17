import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineSquares2X2, HiOutlineBookOpen, HiOutlineBookmarkSquare,
    HiOutlineArchiveBox, HiOutlineUsers, HiOutlineDocumentText,
    HiOutlineArrowRightOnRectangle, HiOutlineBars3, HiOutlineXMark,
    HiOutlineBell, HiOutlineMagnifyingGlass, HiOutlineServerStack,
    HiOutlineCog6Tooth, HiOutlineUser
} from 'react-icons/hi2';
import { logout } from '../features/auth/authSlice';
import { ROUTES } from '../constants';
import toast from 'react-hot-toast';

const adminNavItems = [
    { to: ROUTES.ADMIN_DASHBOARD, icon: HiOutlineSquares2X2, label: 'Dashboard' },
    { to: ROUTES.ADMIN_CONCEPTS, icon: HiOutlineBookOpen, label: 'Concepts' },
    { to: ROUTES.ADMIN_USERS, icon: HiOutlineUsers, label: 'Users' },
    { to: ROUTES.ADMIN_BOOKMARKS, icon: HiOutlineBookmarkSquare, label: 'Bookmarks Analytics' },
    { to: ROUTES.ADMIN_ARCHIVED, icon: HiOutlineArchiveBox, label: 'Archived Concepts' },
    { to: ROUTES.ADMIN_REPORTS, icon: HiOutlineDocumentText, label: 'Reports' },
    { to: ROUTES.ADMIN_SYSTEM_HEALTH, icon: HiOutlineServerStack, label: 'System Health' },
    { to: ROUTES.ADMIN_SETTINGS, icon: HiOutlineCog6Tooth, label: 'Settings' },
];

const AdminLayout = () => {
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
                <title>CAIA Admin</title>
            </Helmet>
            <div className="dashboard-layout">
                {/* Mobile Overlay */}
                {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? 'expanded' : 'collapsed'} ${mobileOpen ? 'mobile-open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            <div className="logo-icon bg-indigo-600">A</div>
                            {sidebarOpen && <span className="logo-text">CAIA Admin</span>}
                        </div>
                        <button className="sidebar-toggle desktop-only" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <HiOutlineBars3 />
                        </button>
                        <button className="sidebar-toggle mobile-only" onClick={closeMobile}>
                            <HiOutlineXMark />
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        {adminNavItems.map(({ to, icon: Icon, label }) => (
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

                        <div style={{ margin: '16px 0', height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }}></div>

                        {/* Link back to User View */}
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            <HiOutlineUser className="sidebar-link-icon" />
                            {sidebarOpen && <span>User View</span>}
                        </NavLink>
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
                                <input type="text" placeholder="Search admin panel..." className="search-input" />
                            </div>
                        </div>
                        <div className="navbar-right">
                            <button className="navbar-icon-btn">
                                <HiOutlineBell />
                            </button>
                            <span className="role-badge" style={{backgroundColor: '#e0e7ff', color: '#4338ca', fontWeight: 'bold'}}>{role || 'admin'}</span>
                            <div className="navbar-avatar" style={{backgroundColor: '#4f46e5'}}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
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

export default AdminLayout;
