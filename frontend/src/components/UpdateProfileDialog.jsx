import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import toast from 'react-hot-toast';
import api from '../services/api';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
    });
    const [file, setFile] = useState(null);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        setFile(e.target.files?.[0]);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (file) {
            formData.append("file", file);
        }

        try {
            setLoading(true);
            const res = await api.post('/user/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Update Profile</h2>
                    <button onClick={() => setOpen(false)} className="text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 p-1 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1 block">Full Name</label>
                        <input 
                            name="fullname" 
                            value={input.fullname} 
                            onChange={changeEventHandler} 
                            className="w-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1 block">Email</label>
                        <input 
                            name="email" 
                            type="email"
                            value={input.email} 
                            onChange={changeEventHandler} 
                            className="w-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1 block">Phone Number</label>
                        <input 
                            name="phoneNumber" 
                            value={input.phoneNumber} 
                            onChange={changeEventHandler} 
                            className="w-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1 block">Bio</label>
                        <textarea 
                            name="bio" 
                            value={input.bio} 
                            onChange={changeEventHandler} 
                            className="w-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-24 resize-none"
                        />
                    </div>
                    {user?.role === 'student' && (
                        <>
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1 block">Skills (comma separated)</label>
                                <input 
                                    name="skills" 
                                    value={input.skills} 
                                    onChange={changeEventHandler} 
                                    placeholder="HTML, CSS, React..."
                                    className="w-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1 block">Resume</label>
                                <input 
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler} 
                                    className="w-full bg-gray-50 dark:bg-[#121212] text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 cursor-pointer
                                    file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-blue-50 dark:file:bg-blue-500/10 file:text-blue-600 dark:file:text-blue-400
                                    hover:file:bg-blue-100 dark:hover:file:bg-blue-500/20 transition-all focus:outline-none"
                                />
                            </div>
                        </>
                    )}

                    <button 
                        disabled={loading}
                        type="submit" 
                        className={`w-full py-3 rounded-xl font-bold text-white transition-all mt-4 ${loading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 shadow-md dark:shadow-[0_0_15px_rgba(37,99,235,0.3)]'}`}
                    >
                        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin"/> Updating...</span> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileDialog;
