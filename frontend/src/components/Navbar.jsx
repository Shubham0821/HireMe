import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Briefcase, Menu, X, Sun, Moon, Bell, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { useTheme } from '../context/ThemeContext';
import useGetNotifications from '../hooks/useGetNotifications';
import { markAllNotificationsAsRead, markNotificationAsRead } from '../redux/notificationSlice';
import { MessageSquare } from 'lucide-react';
import useGetUnreadMessages from '../hooks/useGetUnreadMessages';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { notifications = [], unreadCount = 0 } = useSelector(store => store.notification) || {};
    const { unreadCount: messageUnreadCount = 0 } = useSelector(store => store.message) || {};

    useGetNotifications(); // fetch notifications
    useGetUnreadMessages(); // fetch unread messages count

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notification/mark-read/${id}`);
            dispatch(markNotificationAsRead(id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put(`/notification/mark-all-read`);
            dispatch(markAllNotificationsAsRead());
        } catch (error) {
            console.error(error);
        }
    };

    const logoutHandler = async () => {
        try {
            const res = await api.get('/user/logout');
            if (res.data.success) {
                dispatch(setUser(null));
                toast.success(res.data.message);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error("Error logging out");
        }
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-4 py-3 bg-white/80 dark:bg-transparent backdrop-blur-md border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Modern Logo Section */}
                <Link to="/" className="flex items-center gap-2 group z-50">
                    <div className="bg-blue-100 dark:bg-blue-600/20 p-2 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-600/30 transition-all border border-blue-200 dark:border-blue-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                        <Briefcase className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-white drop-shadow-md">
                        Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">Me</span>
                    </h1>
                </Link>

                <div className="flex items-center gap-3 md:hidden z-50">
                    <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Desktop Links / Auth Section */}
                <div className="hidden md:flex items-center gap-4 lg:gap-6">
                    <div className="flex gap-4 lg:gap-6 items-center flex-wrap">
                        {user?.role === 'recruiter' ? (
                            <>
                                <Link to="/admin/companies" className="text-gray-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-white transition-all">Companies</Link>
                                <Link to="/admin/jobs" className="text-gray-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-white transition-all">Jobs</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="text-gray-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-white transition-all">Home</Link>
                                <Link to="/jobs" className="text-gray-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-white transition-all">Find Jobs</Link>
                                <Link to="/browse" className="text-gray-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-white transition-all">Browse</Link>
                            </>
                        )}
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-2"></div>

                    <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {user && (
                        <div className="flex items-center gap-2 relative">
                            <button onClick={() => navigate('/messages')} className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all relative">
                                <MessageSquare className="h-5 w-5" />
                                {messageUnreadCount > 0 && (
                                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-[#121212]"></span>
                                )}
                            </button>

                            <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#121212]"></span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 top-[120%] w-80 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-[60] transition-all">
                                    <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications && notifications.length > 0 ? (
                                            notifications.map(n => {
                                                const isStudent = user?.role === 'student';
                                                const senderId = n.sender?._id;
                                                const messageLink = `/messages?user=${senderId}`;
                                                const recruiterLink = `/admin/jobs/${n.relatedId?._id}/applicants`;

                                                return (
                                                <div 
                                                    key={n._id} 
                                                    onClick={(e) => {
                                                        // If it's a message-able notification (has a sender), go to chat
                                                        if (senderId) {
                                                            navigate(messageLink);
                                                        } else if (!isStudent && n.relatedId?._id) {
                                                            // Fallback for recruiter to view applicants if no sender
                                                            navigate(recruiterLink);
                                                        }
                                                        
                                                        if (!n.isRead) handleMarkAsRead(n._id);
                                                        setIsNotificationOpen(false);
                                                    }} 
                                                    className={`block p-4 border-b border-gray-50 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                        <div>
                                                            <p className={`text-sm ${!n.isRead ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-slate-300'}`}>{n.message}</p>
                                                            {senderId && (
                                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline">
                                                                    Click to message {n.sender?.fullname || 'user'}
                                                                </p>
                                                            )}
                                                            {!senderId && !isStudent && (
                                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline">
                                                                    Click to view applicants
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )})
                                        ) : (
                                            <div className="p-6 text-center text-gray-500 dark:text-slate-400 text-sm">
                                                No notifications yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!user ? (
                        <div className="flex gap-3 ml-2">
                            <Link to="/login" className="px-5 py-2 rounded-xl font-medium text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 backdrop-blur-md border border-transparent dark:border-white/10 transition-all shadow-sm">
                                Login
                            </Link>
                            <Link to="/register" className="px-5 py-2 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 dark:hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all shadow-md">
                                Signup
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200 dark:border-white/10">
                            <Link to="/profile" className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/5 p-1.5 pr-3 rounded-full transition-all border border-transparent dark:hover:border-white/10">
                                <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-full border border-blue-200 dark:border-blue-500/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/40 transition-colors">
                                    <User className="text-blue-600 dark:text-blue-300 h-5 w-5" />
                                </div>
                                <div className="hidden lg:block text-sm">
                                    <p className="font-semibold text-gray-900 dark:text-slate-100 leading-tight">{user.fullname}</p>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs capitalize tracking-wide">{user.role}</p>
                                </div>
                            </Link>
                            <button onClick={logoutHandler} className="text-gray-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all p-2 rounded-lg" title="Logout">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Dropdown Panel */}
                <div className={`absolute top-[72px] left-0 right-0 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-3xl border-b border-gray-200 dark:border-white/10 p-6 flex flex-col gap-6 md:hidden transition-all duration-300 shadow-2xl ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                    <div className="flex flex-col gap-4 text-center">
                        {user?.role === 'recruiter' ? (
                            <>
                                <Link to="/admin/companies" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-slate-300 font-medium py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all">Companies</Link>
                                <Link to="/admin/jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-slate-300 font-medium py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all">Jobs</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-slate-300 font-medium py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all">Home</Link>
                                <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-slate-300 font-medium py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all">Find Jobs</Link>
                                <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-slate-300 font-medium py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all">Browse</Link>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-white/10 pt-4"></div>

                    {!user ? (
                        <div className="flex flex-col gap-3">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-5 py-3 rounded-xl font-medium text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-transparent dark:border-white/10 transition-all">
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-5 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 transition-all">
                                Signup
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 px-6 rounded-xl border border-gray-200 dark:border-white/10 w-full justify-center">
                                <User className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                                <div className="text-sm text-left">
                                    <p className="font-semibold text-gray-900 dark:text-slate-100">{user.fullname}</p>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs capitalize">{user.role}</p>
                                </div>
                            </Link>
                            <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 py-3 rounded-xl border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all font-medium">
                                <LogOut className="h-5 w-5" /> Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
