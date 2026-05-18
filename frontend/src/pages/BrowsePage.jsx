import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '../redux/jobSlice';
import { Code, Palette, Database, TrendingUp, MonitorPlay, HeartPulse, ChevronRight, X, Loader2 } from 'lucide-react';
import JobCard from '../components/JobCard';
import api from '../services/api';

const BrowsePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoryJobs, setCategoryJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const jobsRef = useRef(null);

    const categories = [
        { name: "Frontend Development", searchKey: "Frontend",  icon: <MonitorPlay className="w-8 h-8 text-blue-600 dark:text-blue-400" />, jobs: 120 },
        { name: "Backend Development",  searchKey: "Backend",   icon: <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />,    jobs: 85 },
        { name: "Data Science",         searchKey: "Data",      icon: <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />,   jobs: 60 },
        { name: "Graphic Design",       searchKey: "Graphic",   icon: <Palette className="w-8 h-8 text-blue-600 dark:text-blue-400" />,      jobs: 45 },
        { name: "Software Engineering", searchKey: "Software Engineer",  icon: <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />,        jobs: 200 },
        { name: "Healthcare",           searchKey: "Healthcare",icon: <HeartPulse className="w-8 h-8 text-blue-600 dark:text-blue-400" />,   jobs: 35 },
    ];

    const handleCategoryClick = async (catName, searchKey) => {
        setActiveCategory(catName);
        setLoading(true);
        setCategoryJobs([]);
        try {
            const res = await api.get(`/job/get?keyword=${encodeURIComponent(searchKey)}`);
            if (res.data.success) {
                setCategoryJobs(res.data.jobs.slice(0, 3));
            } else {
                setCategoryJobs([]);
            }
        } catch {
            setCategoryJobs([]);
        } finally {
            setLoading(false);
            setTimeout(() => {
                jobsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleViewAll = () => {
        navigate(`/jobs?keyword=${encodeURIComponent(activeCategory)}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 relative z-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Browse by Category</h1>
                <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">Explore hundreds of jobs categorized perfectly to match your skills and expertise. Find your next dream role here.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, index) => (
                    <div 
                        key={index} 
                        onClick={() => handleCategoryClick(cat.name, cat.searchKey)}
                        className={`bg-white dark:bg-transparent backdrop-blur-sm border rounded-2xl p-6 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all cursor-pointer group flex flex-col items-center text-center ${activeCategory === cat.name ? 'border-blue-500 shadow-md dark:shadow-[0_8px_30px_rgba(37,99,235,0.3)]' : 'border-gray-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(37,99,235,0.2)]'}`}
                    >
                        <div className={`p-4 rounded-full border mb-4 transition-colors ${activeCategory === cat.name ? 'bg-blue-100 dark:bg-blue-600/30 border-blue-300 dark:border-blue-500/50' : 'bg-blue-50 dark:bg-blue-600/10 border-blue-200 dark:border-blue-500/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-600/20'}`}>
                            {cat.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-500/10 px-4 py-1 rounded-full border border-blue-200 dark:border-blue-500/20 text-sm">
                            {cat.jobs} Active Jobs
                        </p>
                    </div>
                ))}
            </div>

            {/* Expanded Category Jobs Section */}
            {activeCategory && (
                <div ref={jobsRef} className="mt-16">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-white/10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                                Top {activeCategory} Jobs
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-500/30 font-medium">Live</span>
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400 mt-2">Here is a quick preview of some popular openings.</p>
                        </div>
                        <button 
                            onClick={() => { setActiveCategory(null); setCategoryJobs([]); }}
                            className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-gray-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-full transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {categoryJobs.length > 0 ? (
                                categoryJobs.map((item) => (
                                    <JobCard key={item._id} job={item} />
                                ))
                            ) : (
                                <div className="col-span-full py-6 text-center border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/5">
                                    <p className="text-gray-500 dark:text-slate-400">No jobs found in this category yet. Be the first to post one!</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-center bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 p-8 rounded-2xl">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Want to see more {activeCategory} opportunities?</h3>
                        <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-lg mx-auto">We have hundreds of other listings matching this category with advanced filters available.</p>
                        <button 
                            onClick={handleViewAll}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all"
                        >
                            View All Jobs <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {!activeCategory && (
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Didn't find your category?</h2>
                    <button 
                        onClick={() => navigate('/jobs')}
                        className="px-8 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold rounded-xl transition-all"
                    >
                        Search All Jobs
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrowsePage;
