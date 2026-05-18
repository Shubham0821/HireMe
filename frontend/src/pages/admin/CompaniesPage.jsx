import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Loader2, MapPin, Globe } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCompanies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await api.get('/company/get');
            if (res.data.success) {
                setCompanies(res.data.companies);
            }
        } catch (error) {
            console.error(error);
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your Companies</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Manage all the companies you've registered to post jobs.</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/companies/create')} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                    <Plus className="w-5 h-5" /> New Company
                </button>
            </div>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
            ) : companies.length === 0 ? (
                <div className="bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-full inline-block border border-blue-200 dark:border-blue-500/20 mb-4">
                        <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Companies Found</h2>
                    <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">You haven't registered any companies yet. Create a company profile first before posting jobs.</p>
                    <button 
                        onClick={() => navigate('/admin/companies/create')} 
                        className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-6 py-2.5 rounded-xl font-medium transition-all"
                    >
                        Register a Company
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company._id} className="bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-[#2A2A2A] border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shrink-0 overflow-hidden">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-blue-600 dark:text-blue-300 text-2xl">
                                            {company.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">{company.name}</h2>
                                    {company.location && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 mt-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {company.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {company.description && (
                                <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">
                                    {company.description}
                                </p>
                            )}

                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
                                {company.website && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        <Globe className="w-4 h-4" />
                                        <a href={company.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCompanies;
