import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, Pen, FileText, Loader2, MapPin, Building2 } from 'lucide-react';
import UpdateProfileDialog from '../components/UpdateProfileDialog';
import api from '../services/api';

const ProfilePage = () => {
    const [open, setOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [adminJobs, setAdminJobs] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (user?.role === 'student') {
            setLoadingApps(true);
            api.get('/application/get')
                .then(res => { if (res.data.success) setApplications(res.data.applications); })
                .catch(() => setApplications([]))
                .finally(() => setLoadingApps(false));
        }
        if (user?.role === 'recruiter') {
            setLoadingApps(true);
            api.get('/job/getadminjobs')
                .then(res => { if (res.data.success) setAdminJobs(res.data.jobs); })
                .catch(() => setAdminJobs([]))
                .finally(() => setLoadingApps(false));
        }
    }, [user]);

    if (!user) return <div className="text-center text-gray-900 dark:text-white py-20 text-xl">Please Login to View Profile</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 pt-28 pb-20 relative z-10 text-gray-900 dark:text-white animate-fade-in-up">
            <div className="bg-white dark:bg-transparent/10 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                        <div className="w-24 h-24 rounded-full border-2 border-blue-500 overflow-hidden bg-blue-50 dark:bg-blue-900/50 flex justify-center items-center shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0">
                            {user?.profile?.profilePhoto ? (
                                <img src={user.profile.profilePhoto} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-blue-600 dark:text-blue-300">{user?.fullname?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="pt-2">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight flex items-center gap-3">
                                Welcome back, {user?.fullname?.split(" ")[0]} 👋
                            </h1>
                            <div className="flex items-center gap-3 mt-2 mb-3">
                                <p className="text-gray-500 dark:text-slate-400 capitalize bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 inline-block px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-500/30 tracking-wide">
                                    {user?.role}
                                </p>
                                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Beautiful day for new opportunities!</p>
                            </div>
                            <p className="text-gray-600 dark:text-slate-300 mt-3 text-sm max-w-lg leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
                                {user?.profile?.bio || "You haven't written a bio yet. Don't be shy, tell recruiters a little bit about what makes you amazing!"}
                            </p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-center">
                        <button 
                            onClick={() => setOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-slate-200 transition-all font-medium shadow-sm w-full justify-center"
                        >
                            <Pen className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* Contact Detail Section */}
                <div className="my-10 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4 mb-4">Contact Information</h2>
                    <div className="flex items-center gap-4 text-gray-700 dark:text-slate-300 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-700 dark:text-slate-300 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 mt-3">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{user?.phoneNumber}</span>
                    </div>
                </div>

                {/* Student Specific Sections: Skills & Resume */}
                {user?.role === 'student' && (
                    <>
                        {/* Skills Section */}
                        <div className="my-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4 mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {user?.profile?.skills && user.profile.skills.length > 0 ? (
                                    user.profile.skills.map((item, index) => (
                                        <span key={index} className="bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-200 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                                            {item}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 dark:text-slate-500 italic bg-gray-50 dark:bg-[#0B0F19]/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5 flex items-center gap-2">
                                        You haven't listed any skills yet. What are you great at?
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4 mb-4">Resume</h2>
                            <div className="mt-4">
                                {user?.profile?.resumeOriginalName ? (
                                    <a 
                                        target="_blank" 
                                        href={user?.profile?.resume} 
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors w-max p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-500/20"
                                    >
                                        <FileText className="w-5 h-5" /> 
                                        <span className="font-medium">{user?.profile?.resumeOriginalName}</span>
                                    </a>
                                ) : (
                                    <span className="text-gray-500 dark:text-slate-500 italic bg-gray-50 dark:bg-[#0B0F19]/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5 block w-max">
                                        No resume uploaded yet. Your future employer is waiting to see it!
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                )}

            </div>
            
            {/* Applications / Posted Jobs Section */}
            <div className="mt-8 bg-white dark:bg-transparent/10 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    {user?.role === 'student' ? "🚀 Your Application Journey" : "📝 My Posted Jobs"}
                </h1>

                {user?.role === 'student' && (
                    loadingApps ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" /></div>
                    ) : applications.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {applications.map((app) => {
                                const statusStyle = {
                                    pending: 'text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20',
                                    accepted: 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
                                    rejected: 'text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
                                }[app.status] || 'text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10';

                                return (
                                    <div key={app._id} className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex-wrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#1E1E1E] border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
                                                <span className="font-bold text-blue-600 dark:text-blue-300">
                                                    {app.job?.company?.name?.charAt(0) || (typeof app.job?.company === 'string' ? app.job.company.charAt(0) : '?')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{app.job?.title || app.job?.jobTitle || 'Job'}</p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{app.job?.company?.name || app.job?.company || 'Company'}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.job?.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${statusStyle}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-blue-200 dark:border-blue-500/20 rounded-xl bg-blue-50 dark:bg-blue-500/5">
                            <p className="text-gray-700 dark:text-slate-300 font-medium mb-1">It looks a little quiet here!</p>
                            <p className="text-gray-500 dark:text-slate-400 text-sm">You haven't applied to any jobs yet. Let's explore some amazing opportunities together.</p>
                        </div>
                    )
                )}

                {user?.role === 'recruiter' && (
                    loadingApps ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" /></div>
                    ) : adminJobs.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {adminJobs.map((job) => (
                                <div key={job._id} className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex-wrap">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#1E1E1E] border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
                                            <span className="font-bold text-blue-600 dark:text-blue-300">{job.company?.name?.charAt(0) || '?'}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{job.title}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{job.company?.name}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-bold rounded-full border text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20">
                                        {job.applications?.length || 0} Applicant{(job.applications?.length || 0) !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-blue-200 dark:border-blue-500/20 rounded-xl bg-blue-50 dark:bg-blue-500/5">
                            <p className="text-gray-700 dark:text-slate-300 font-medium mb-1">No jobs posted yet.</p>
                            <p className="text-gray-500 dark:text-slate-400 text-sm">Go to <span className="text-blue-600 dark:text-blue-400 font-medium">Jobs</span> section in navbar to post your first job.</p>
                        </div>
                    )
                )}
            </div>
            
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default ProfilePage;
