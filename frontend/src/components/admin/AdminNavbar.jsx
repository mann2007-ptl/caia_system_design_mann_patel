import React from 'react';
import { FiSearch, FiBell, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { ROUTES } from '../../constants';

const AdminNavbar = ({ toggleSidebar }) => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDark, setIsDark] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate(ROUTES.LOGIN);
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8 shadow-sm">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
                >
                    <FiMenu size={20} />
                </button>
                
                <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <FiSearch className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="bg-transparent border-none focus:outline-none text-sm ml-2 w-64 text-slate-700 placeholder-slate-400"
                    />
                    <div className="text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 ml-2">⌘K</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
                
                <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative transition-colors">
                    <FiBell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-slate-700 leading-none">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-slate-500 mt-1">{user?.role || 'Administrator'}</p>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                            </div>
                            <button onClick={() => {navigate(ROUTES.ADMIN_SETTINGS); setIsProfileOpen(false);}} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                Settings
                            </button>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
