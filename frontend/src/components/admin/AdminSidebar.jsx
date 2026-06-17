import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { 
    FiHome, FiPieChart, FiBookOpen, FiUsers, 
    FiGrid, FiBookmark, FiArchive, FiFileText, 
    FiActivity, FiSettings
} from 'react-icons/fi';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const navItems = [
        { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <FiHome /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <FiPieChart /> },
        { name: 'Concepts', path: ROUTES.ADMIN_CONCEPTS, icon: <FiBookOpen /> },
        { name: 'Users', path: ROUTES.ADMIN_USERS, icon: <FiUsers /> },
        { name: 'Categories', path: '/admin/categories', icon: <FiGrid /> },
        { name: 'Bookmarks Analytics', path: ROUTES.ADMIN_BOOKMARKS, icon: <FiBookmark /> },
        { name: 'Archived Concepts', path: ROUTES.ADMIN_ARCHIVED, icon: <FiArchive /> },
        { name: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: <FiFileText /> },
        { name: 'System Health', path: ROUTES.ADMIN_SYSTEM_HEALTH, icon: <FiActivity /> },
        { name: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: <FiSettings /> },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-30 transition-transform duration-300 ease-in-out flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            `}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 text-blue-600 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                            CA
                        </div>
                        CAIA Admin
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>
                    <nav className="space-y-1">
                        {navItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                    ${isActive 
                                        ? 'bg-blue-50 text-blue-600 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.2)]' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                            >
                                <span className="text-lg opacity-80">{item.icon}</span>
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                
                <div className="p-4 border-t border-slate-200">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1">System Status</p>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            All systems operational
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
