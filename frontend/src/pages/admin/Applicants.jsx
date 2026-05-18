import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft, Mail, Phone, FileText, CheckCircle, XCircle, User } from 'lucide-react';

const Applicants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // stores applicationId being updated

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await api.get(`/application/${id}/applicants`);
                if (res.data.success) {
                    setApplicants(res.data.job.applications);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load applicants.");
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [id]);

    const statusHandler = async (status, applicationId) => {
        try {
            setActionLoading(applicationId);
            const res = await api.put(`/application/status/${applicationId}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
                // Update local state
                setApplicants(prev => prev.map(app => 
                    app._id === applicationId ? { ...app, status: status.toLowerCase() } : app
                ));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 relative z-10 text-gray-900 dark:text-white">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/admin/jobs')}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-slate-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Review and manage candidates for this job.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
            ) : applicants?.length === 0 ? (
                <div className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-full inline-block mb-4">
                        <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No Applicants Yet</h2>
                    <p className="text-gray-500 dark:text-slate-400">Wait for candidates to apply for this position.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applicants.map((app) => (
                        <div key={app._id} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300 text-xl overflow-hidden border border-blue-200 dark:border-blue-500/30">
                                            {app.applicant?.profile?.profilePhoto ? (
                                                <img src={app.applicant.profile.profilePhoto} alt="profile" className="h-full w-full object-cover" />
                                            ) : (
                                                app.applicant?.fullname?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{app.applicant?.fullname}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : app.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'} capitalize`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{app.applicant?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{app.applicant?.phoneNumber}</span>
                                    </div>
                                    {app.applicant?.profile?.resume && (
                                        <div className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                            <FileText className="w-4 h-4" />
                                            <a href={app.applicant.profile.resume} target="_blank" rel="noopener noreferrer">
                                                View Resume
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                                <button 
                                    onClick={() => statusHandler('Accepted', app._id)}
                                    disabled={actionLoading === app._id || app.status === 'accepted'}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 transition-all font-medium disabled:opacity-50 text-sm"
                                >
                                    {actionLoading === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Accept
                                </button>
                                <button 
                                    onClick={() => statusHandler('Rejected', app._id)}
                                    disabled={actionLoading === app._id || app.status === 'rejected'}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-all font-medium disabled:opacity-50 text-sm"
                                >
                                    {actionLoading === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applicants;
