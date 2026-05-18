import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const PostJobPage = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        position: "",
        companyId: ""
    });

    // Fetch user's registered companies so they can select which company to post for
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/company/get', {
                    withCredentials: true
                });
                if(res.data.success){
                    setCompanies(res.data.companies);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load your companies. Register a company first!");
            }
        }
        fetchCompanies();
    }, []);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/v1/job/post', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 relative z-10">
            <button 
                onClick={() => navigate('/admin/companies')}
                className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>

            <div className="bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
                    <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-xl border border-blue-200 dark:border-blue-500/30">
                        <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Post a New Job</h1>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Fill out the details below to create a new job listing.</p>
                    </div>
                </div>

                <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Title */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Job Title</label>
                        <input type="text" name="title" value={input.title} onChange={changeEventHandler} placeholder="e.g. Frontend Developer" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner" required />
                    </div>

                    {/* Description */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Description</label>
                        <textarea name="description" value={input.description} onChange={changeEventHandler} placeholder="Tell us about the role..." rows="4" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner" required></textarea>
                    </div>

                    {/* Requirements */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Requirements <span className="text-gray-400 dark:text-slate-500 text-xs normal-case">(comma separated)</span></label>
                        <input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="React, Nodejs, MongoDB" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner" required />
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Salary (LPA)</label>
                        <input type="number" name="salary" value={input.salary} onChange={changeEventHandler} placeholder="12" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner" required />
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Experience Level (Years)</label>
                        <input type="number" name="experienceLevel" value={input.experienceLevel} onChange={changeEventHandler} placeholder="2" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner" required />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Location</label>
                        <input type="text" name="location" value={input.location} onChange={changeEventHandler} placeholder="Bangalore, India" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner" required />
                    </div>

                    {/* Job Type */}
                    <div>
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Job Type</label>
                        <select name="jobType" value={input.jobType} onChange={changeEventHandler} className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-inner appearance-none cursor-pointer" required>
                            <option value="">Select Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    {/* Positions */}
                    <div>
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">No of Positions</label>
                        <input type="number" name="position" value={input.position} onChange={changeEventHandler} placeholder="4" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner" required />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider">Select Company</label>
                        <select name="companyId" value={input.companyId} onChange={changeEventHandler} className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-inner appearance-none cursor-pointer" required>
                            <option value="">Select Company</option>
                            {companies.length > 0 ? (
                                companies.map((company) => (
                                    <option key={company._id} value={company._id}>{company.name}</option>
                                ))
                            ) : (
                                <option value="" disabled>No Companies Registered</option>
                            )}
                        </select>
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                        {companies.length === 0 ? (
                            <p className="text-rose-500 dark:text-rose-400 text-center font-medium bg-rose-50 dark:bg-rose-500/10 py-3 rounded-lg border border-rose-200 dark:border-rose-500/20 mb-4">
                                You must register a company first from the dashboard.
                            </p>
                        ) : null}
                        
                        <button 
                            type="submit" 
                            disabled={loading || companies.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                                loading || companies.length === 0 
                                ? 'bg-gray-300 dark:bg-slate-700/50 text-gray-500 dark:text-slate-500 border border-gray-400 dark:border-slate-600/50 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]'
                            }`}
                        >
                            {loading ? "Processing..." : "Submit Job Listing"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PostJobPage;
