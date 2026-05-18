import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Trash2, Pencil, Users, Loader2, MapPin, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/job/getadminjobs');
            if (res.data.success) {
                setJobs(res.data.jobs);
            }
        } catch {
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        setDeletingId(jobId);
        try {
            const res = await api.delete(`/job/delete/${jobId}`);
            if (res.data.success) {
                toast.success('Job deleted successfully!');
                setJobs(prev => prev.filter(j => j._id !== jobId));
            }
        } catch {
            toast.error('Failed to delete job.');
        } finally {
            setDeletingId(null);
        }
    };

    const statusColor = (count) => {
        if (count === 0) return 'text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10';
        if (count < 5) return 'text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20';
        return 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 relative z-10 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your Posted Jobs</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                        {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} posted`}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/jobs/create')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                    <Plus className="w-5 h-5" /> Post New Job
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-full inline-block border border-blue-200 dark:border-blue-500/20 mb-4">
                        <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Jobs Posted Yet</h2>
                    <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">Register a company first, then post your first job listing.</p>
                    <button onClick={() => navigate('/admin/jobs/create')} className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-6 py-2.5 rounded-xl font-medium transition-all">
                        Post a Job
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 backdrop-blur-sm rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all">
                            {/* Left Info */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#1E1E1E] border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-blue-600 dark:text-blue-300 text-xl">
                                        {job.company?.name?.charAt(0) || (typeof job.company === 'string' ? job.company.charAt(0) : '?')}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-bold text-gray-900 dark:text-white text-lg truncate">{job.title || job.jobTitle}</h2>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400 mt-0.5 flex-wrap">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                                        <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{job.salary} LPA</span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full">{job.jobType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Applicant count */}
                            <button 
                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer hover:shadow-md transition-all ${statusColor(job.applications?.length || 0)}`}
                            >
                                <Users className="w-4 h-4" />
                                {job.applications?.length || 0} Applicant{(job.applications?.length || 0) !== 1 ? 's' : ''}
                            </button>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate(`/admin/jobs/create?edit=${job._id}`)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-slate-300 transition-all font-medium"
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job._id)}
                                    disabled={deletingId === job._id}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all font-medium disabled:opacity-50"
                                >
                                    {deletingId === job._id
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Trash2 className="w-4 h-4" />
                                    }
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminJobs;
