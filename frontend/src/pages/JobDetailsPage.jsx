import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, ShieldCheck, Clock, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useSelector } from 'react-redux';

const JobDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/job/get/${id}`);
                if (res.data.success) {
                    setJob(res.data.job);
                }

                // Check if user already applied using dedicated API
                if (user && user.role === 'student') {
                    try {
                        const appliedRes = await api.get('/application/get');
                        if (appliedRes.data.success) {
                            const alreadyApplied = appliedRes.data.applications.some(
                                app => app.job?._id === id || app.job === id
                            );
                            setIsApplied(alreadyApplied);
                        }
                    } catch {
                        // user has no applications yet — that's fine
                    }
                }
            } catch (error) {
                toast.error("Could not load job details.");
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, user]);

    const handleApply = async () => {
        if (!user) {
            toast.error("Please login to apply for jobs.");
            navigate('/login');
            return;
        }
        if (user.role === 'recruiter') {
            toast.error("Recruiters cannot apply for jobs.");
            return;
        }
        try {
            setApplying(true);
            const res = await api.post(`/application/apply/${id}`);
            if (res.data.success) {
                setIsApplied(true);
                toast.success("Application submitted successfully! 🎉");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen relative z-10">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
        );
    }

    if (!job) return null;

    const postedDaysAgo = job.createdAt
        ? Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 relative z-10 text-gray-900 dark:text-white">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Jobs
            </button>

            {/* Header / Main Details */}
            <div className="bg-white dark:bg-transparent backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 mb-8 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        {/* Company Logo Initial */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-[#1E1E1E] border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shadow-inner">
                                <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl">
                                    {job.company?.name?.charAt(0) || (typeof job.company === 'string' ? job.company.charAt(0) : '?')}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl text-blue-600 dark:text-blue-400 font-semibold tracking-wide">
                                    {job.company?.name || job.company || 'Company'}
                                </h2>
                                <p className="text-gray-500 dark:text-slate-500 text-sm">{job.company?.location || ''}</p>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 drop-shadow-sm">{job.title || job.jobTitle}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-slate-300 font-medium text-sm">
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gray-400 dark:text-slate-400" /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-gray-400 dark:text-slate-400" /> {job.experienceLevel} yrs exp</span>
                            <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-gray-400 dark:text-slate-400" /> {job.salary} LPA</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gray-400 dark:text-slate-400" /> {postedDaysAgo === 0 ? 'Today' : `${postedDaysAgo} days ago`}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        {user?.role !== 'recruiter' && (
                            <button
                                onClick={handleApply}
                                disabled={isApplied || applying}
                                className={`w-full md:w-48 py-3.5 rounded-xl font-bold transition-all shadow-md tracking-wider flex items-center justify-center gap-2 ${
                                    isApplied
                                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5'
                                }`}
                            >
                                {applying ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                                {isApplied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
                            </button>
                        )}
                        <p className="text-xs text-gray-500 dark:text-slate-500 font-medium">{job.applications?.length || 0} applicants so far</p>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Col */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4 border-b border-gray-200 dark:border-white/10 pb-4">Job Description</h3>
                        <p className="text-gray-600 dark:text-slate-400 leading-relaxed font-light text-lg">{job.description}</p>
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-5 border-b border-gray-200 dark:border-white/10 pb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-3">
                            {job.requirements?.map((skill, index) => (
                                <span key={index} className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 rounded-xl text-sm font-semibold tracking-wide">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                            <ShieldCheck className="text-blue-600 dark:text-blue-400 h-5 w-5" /> Quick Overview
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-1">Company</p>
                                <p className="text-gray-800 dark:text-slate-200 font-medium">{job.company?.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-1">Role Type</p>
                                <p className="text-gray-800 dark:text-slate-200 font-medium">{job.jobType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-1">Positions Open</p>
                                <p className="text-gray-800 dark:text-slate-200 font-medium">{job.position}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                                <p className="text-gray-800 dark:text-slate-200 font-medium">{job.location}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-1">Salary</p>
                                <p className="text-gray-800 dark:text-slate-200 font-medium">{job.salary} LPA</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default JobDetailsPage;
