import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '../redux/jobSlice';
import api from '../services/api';

const categories = [
    { label: "Frontend Developer",  keyword: "Frontend" },
    { label: "Backend Developer",   keyword: "Backend" },
    { label: "Data Science",        keyword: "Data" },
    { label: "Graphic Designer",    keyword: "Graphic" },
    { label: "Software Engineer",   keyword: "Software Engineer" },
    { label: "UI/UX Design",        keyword: "Design" },
    { label: "Healthcare",          keyword: "Healthcare" },
];

const HomePage = () => {
    const [query, setQuery] = useState('');
    const [latestJobs, setLatestJobs] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch latest jobs on load
    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await api.get('/job/get');
                if (res.data.success) {
                    setLatestJobs(res.data.jobs.slice(0, 3));
                }
            } catch (e) { /* silent */ }
        };
        fetchLatest();
    }, []);

    const searchHandler = () => {
        if (query.trim()) {
            navigate(`/jobs?keyword=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') searchHandler();
    };
    return (
        <div className="text-gray-900 dark:text-white transition-colors duration-300">
            {/* Dark Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
                <div className="mx-auto max-w-3xl py-20 sm:py-32 lg:py-40 text-center relative z-10">

                    {/* Glowing Badge */}
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center animate-fade-in-down">
                        <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 dark:text-slate-300 ring-1 ring-gray-200 dark:ring-white/10 hover:ring-gray-300 dark:hover:ring-white/30 cursor-pointer transition-all bg-white dark:bg-white/5 backdrop-blur-sm shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            Announcing our new recruiter dashboard. <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></Link>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-6 leading-[1.1] drop-shadow-lg">
                        Hi there! Let's find your <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">Dream Job</span>
                    </h1>
                    <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-light">
                        Whether you're looking for your very first role or the next big step in your career, we're here to help you get discovered by the best companies.
                    </p>

                    {/* Glowing Dark Search Bar */}
                    <div className="flex w-full items-center gap-2 max-w-2xl mx-auto bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-xl p-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                        <div className="pl-5">
                            <Search className="text-gray-400 dark:text-slate-400 h-6 w-6" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What role are you looking for today?"
                            className="w-full text-gray-900 dark:text-white py-3 px-3 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 text-lg font-medium tracking-wide"
                        />
                        <button
                            onClick={searchHandler}
                            className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-full px-8 py-3.5 font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all tracking-wide"
                        >
                            Search
                        </button>
                    </div>

                </div>

                {/* Decorative Background Glows */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-[120px] sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>

            {/* Category Carousel Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 border-t border-gray-200 dark:border-white/5 relative z-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10 tracking-tight">Popular Categories</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((cat, index) => (
                        <button 
                            key={index} 
                            onClick={() => {
                                navigate(`/jobs?keyword=${encodeURIComponent(cat.keyword)}`);
                            }}
                            className="px-6 py-3 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E1E1E]/40 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-600/20 dark:hover:border-blue-500/50 text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 hover:shadow-sm dark:hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all font-medium"
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Latest Jobs Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gray-50/50 dark:bg-transparent border-t border-gray-200 dark:border-white/5 z-0"></div>
                <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center tracking-tight">
                        A Quick Look at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">Fresh Opportunities</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {latestJobs.length > 0 ? (
                            latestJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))
                        ) : (
                            <div className="col-span-full py-10 text-center text-gray-500 dark:text-slate-400">
                                No jobs posted yet. Check back soon!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Simple Dark Footer */}
            <footer className="bg-transparent backdrop-blur-sm border-t border-gray-200 dark:border-white/10 py-10 text-center text-gray-500 dark:text-slate-500 font-medium">
                <p>&copy; {new Date().getFullYear()} HireMe Project. All rights reserved.</p>
            </footer>

        </div>
    );
};

export default HomePage;
