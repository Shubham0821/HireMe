import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';

const LoginPrompt = () => {
    const { user } = useSelector(store => store.auth);
    const [showPrompt, setShowPrompt] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // If user is already logged in, do not show
        if (user) return;
        
        // Don't show if already on login or register pages
        if (location.pathname === '/login' || location.pathname === '/register') return;

        // Check using sessionStorage so it doesn't show multiple times per session
        const hasSeenPrompt = sessionStorage.getItem('hasSeenLoginPrompt');
        if (hasSeenPrompt) return;

        // Show prompt after 5 seconds on site
        const timer = setTimeout(() => {
            setShowPrompt(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, [user, location.pathname]);

    const handleClose = () => {
        setShowPrompt(false);
        sessionStorage.setItem('hasSeenLoginPrompt', 'true');
    };

    if (!showPrompt || user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative bg-white dark:bg-[#1E1E1E] border border-blue-300 dark:border-blue-500/30 p-8 rounded-3xl shadow-xl dark:shadow-[0_0_60px_rgba(37,99,235,0.25)] max-w-md w-full text-center animate-in zoom-in-95 duration-500">
                <button 
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-2 bg-gray-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-gray-400 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-full transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="w-20 h-20 bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-200 dark:border-blue-500/30 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
                    <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Unlock Your Career</h2>
                <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                    Create a free account to save your favorite jobs, build your profile, and apply with just one click.
                </p>
                
                <div className="flex flex-col gap-3">
                    <Link 
                        to="/register" 
                        onClick={handleClose}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all"
                    >
                        Create an Account
                    </Link>
                    <Link 
                        to="/login" 
                        onClick={handleClose}
                        className="w-full py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-white/10 transition-all"
                    >
                        Login to Existing Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPrompt;
