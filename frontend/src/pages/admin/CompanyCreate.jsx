import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/v1/company/register', {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                toast.success(res.data.message);
                navigate(`/admin/companies`); // We will implement the dashboard shortly
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to register company.");
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 relative z-10 min-h-[85vh] flex items-center justify-center">
            <div className="bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] w-full max-w-2xl">
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="bg-blue-100 dark:bg-blue-600/20 p-4 rounded-full border border-blue-200 dark:border-blue-500/30 mb-5 inline-block">
                        <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Setup Your Company</h1>
                    <p className="text-gray-500 dark:text-slate-400 text-lg">What would you like to give your company name? You can change this later.</p>
                </div>
                
                <div className="max-w-lg mx-auto">
                    <div className="mb-10">
                        <label className="block text-gray-600 dark:text-slate-300 text-sm font-bold mb-3 uppercase tracking-wider">Company Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Google, Microsoft, Startup Inc."
                            className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner text-lg"
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                        <button 
                            onClick={() => navigate("/profile")}
                            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all w-full sm:w-1/2"
                        >
                            <ArrowLeft className="w-5 h-5" /> Cancel
                        </button>
                        <button 
                            onClick={registerNewCompany}
                            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all w-full sm:w-1/2"
                        >
                            Continue <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate;
