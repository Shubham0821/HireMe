import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { X, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await api.post('/user/register', formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 pt-24 pb-12 relative z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent -z-10"></div>
            
            <form onSubmit={submitHandler} className="w-full max-w-md bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h1 className="font-extrabold text-3xl mb-2 text-gray-900 dark:text-white tracking-tight">Create Account</h1>
                    <p className="text-gray-500 dark:text-slate-400 font-medium text-sm">Join HireMe and take the next step in your career.</p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full p-3.5 bg-gray-50 dark:bg-[#121212]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600" 
                            placeholder="John Doe" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Email address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3.5 bg-gray-50 dark:bg-[#121212]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600" 
                            placeholder="you@example.com" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Phone Number</label>
                        <input 
                            type="text" 
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-3.5 bg-gray-50 dark:bg-[#121212]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600" 
                            placeholder="9876543210" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-slate-300 mb-1.5">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3.5 pr-12 bg-gray-50 dark:bg-[#121212]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600" 
                                placeholder="••••••••" 
                                required 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2">Account Type</label>
                        <div className="flex gap-4">
                            <label className={`flex items-center justify-center gap-2 cursor-pointer p-3 border rounded-xl flex-1 transition-all ${formData.role === 'student' ? 'bg-blue-100 dark:bg-blue-600/20 border-blue-400 dark:border-blue-500/50 text-gray-900 dark:text-white' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                                <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} className="hidden" />
                                <span className="font-medium">Student</span>
                            </label>
                            <label className={`flex items-center justify-center gap-2 cursor-pointer p-3 border rounded-xl flex-1 transition-all ${formData.role === 'recruiter' ? 'bg-blue-100 dark:bg-blue-600/20 border-blue-400 dark:border-blue-500/50 text-gray-900 dark:text-white' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                                <input type="radio" name="role" value="recruiter" checked={formData.role === 'recruiter'} onChange={handleChange} className="hidden" />
                                <span className="font-medium">Recruiter</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl focus:outline-none transition-all shadow-md hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] disabled:opacity-50 tracking-wide"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
                
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400 font-medium">
                    Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline font-semibold">Sign in</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
