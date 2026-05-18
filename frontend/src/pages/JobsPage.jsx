import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const JobsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Read all filters directly from URL
    const keyword   = searchParams.get('keyword')   || '';
    const location  = searchParams.get('location')  || '';
    const minSalary = searchParams.get('minSalary') || '';
    const maxSalary = searchParams.get('maxSalary') || '';

    // Build a readable label for the active filter chip
    let activeFilters = [];
    if (keyword) activeFilters.push(`Search: ${keyword}`);
    if (location) activeFilters.push(`Location: ${location}`);
    if (minSalary || maxSalary) {
        activeFilters.push(`Salary: ${minSalary || '0'} – ${maxSalary || '∞'} LPA`);
    }
    const filterLabel = activeFilters.join(' | ');

    // Fetch jobs whenever URL params change
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (keyword)   params.append('keyword',   keyword);
                if (location)  params.append('location',  location);
                if (minSalary) params.append('minSalary', minSalary);
                if (maxSalary) params.append('maxSalary', maxSalary);

                const res = await api.get(`/job/get?${params.toString()}`);
                setJobs(res.data?.jobs || []);
            } catch {
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [keyword, location, minSalary, maxSalary]);

    // Called by FilterSidebar — update URL params (never pass objects to React render)
    const handleFilter = (value) => {
        const newParams = new URLSearchParams(searchParams);

        if (typeof value === 'string') {
            // keyword/category filter
            if (value) newParams.set('keyword', value);
            else newParams.delete('keyword');
        } else if (value?.filterType === 'location') {
            if (value.value) newParams.set('location', value.value);
            else newParams.delete('location');
        } else if (value?.filterType === 'salary') {
            if (value.min != null) newParams.set('minSalary', String(value.min));
            else newParams.delete('minSalary');
            
            if (value.max != null) newParams.set('maxSalary', String(value.max));
            else newParams.delete('maxSalary');
        }
        
        setSearchParams(newParams);
    };

    const clearFilter = () => setSearchParams({});

    return (
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 relative z-10 text-gray-900 dark:text-white">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Filter Sidebar */}
                <div className="w-full lg:w-[28%] xl:w-1/4 lg:self-start lg:sticky lg:top-[100px] z-20">
                    <FilterSidebar setSelectedFilter={handleFilter} />
                </div>

                {/* Job Feed */}
                <div className="w-full lg:w-[72%] xl:w-3/4">
                    <div className="mb-8 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-sm">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                            Available Jobs
                        </h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">
                            Explore and find the best match for your skills.
                        </p>

                        {/* Active filter chip */}
                        {filterLabel && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-blue-600 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-4 py-1.5 rounded-full inline-flex shadow-sm">
                                Filtered by:
                                <span className="text-gray-900 dark:text-white ml-1">{filterLabel}</span>
                                <button
                                    onClick={clearFilter}
                                    className="ml-2 text-rose-500 dark:text-rose-400 hover:text-rose-400 dark:hover:text-rose-300 transition-colors"
                                >
                                    (Clear)
                                </button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-24">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))
                            ) : (
                                <div className="col-span-full py-10 text-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No jobs found</h2>
                                    <p className="text-gray-500 dark:text-slate-400">Try adjusting your filter or search query.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobsPage;
