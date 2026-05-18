import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const filterData = [
    {
        filterType: "Industry / Category",
        type: "keyword",
        array: [
            { label: "Frontend Development",  value: "Frontend" },
            { label: "Backend Development",   value: "Backend" },
            { label: "Software Engineering",  value: "Software Engineer" },
            { label: "Data Science",          value: "Data" },
            { label: "Graphic Design",        value: "Graphic" },
            { label: "Healthcare",            value: "Healthcare" },
        ]
    },
    {
        filterType: "Salary (LPA)",
        type: "salary",
        array: [
            { label: "0 – 5 LPA",    min: 0,   max: 5 },
            { label: "5 – 10 LPA",   min: 5,   max: 10 },
            { label: "10 – 20 LPA",  min: 10,  max: 20 },
            { label: "20+ LPA",      min: 20,  max: null },
        ]
    },
];

const FilterSidebar = ({ setSelectedFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const [locationInput, setLocationInput] = useState('');

    useEffect(() => {
        setLocationInput(searchParams.get('location') || '');
    }, [searchParams]);

    const handleLocationSearch = (e) => {
        e.preventDefault();
        setSelectedFilter({ filterType: "location", value: locationInput.trim() });
        if (window.innerWidth < 768) setIsOpen(false);
    };

    const changeHandler = (type, item) => {
        if (type === "keyword") {
            setSelectedFilter(item.value);
        } else if (type === "salary") {
            setSelectedFilter({ filterType: "salary", min: item.min, max: item.max });
        }

        if (window.innerWidth < 768) setIsOpen(false);
    };

    const isChecked = (type, item) => {
        if (type === "keyword") {
            return searchParams.get('keyword') === item.value;
        } else if (type === "salary") {
            const minParam = searchParams.get('minSalary');
            const maxParam = searchParams.get('maxSalary');
            
            // Check if URL params match this item's min and max exactly
            const itemMinStr = item.min != null ? String(item.min) : null;
            const itemMaxStr = item.max != null ? String(item.max) : null;
            
            // Both min and max matches (or both are null)
            return (minParam === itemMinStr && maxParam === itemMaxStr);
        }
        return false;
    };

    return (
        <div className="w-full bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-gray-900 dark:text-white transition-all duration-300">
            <div 
                className="flex justify-between items-center cursor-pointer md:cursor-auto"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h1 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Filter Jobs
                </h1>
                <div className="md:hidden">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 dark:text-slate-400" /> : <ChevronDown className="w-5 h-5 text-gray-400 dark:text-slate-400" />}
                </div>
            </div>
            
            <div className={`${isOpen ? 'block mt-5 pt-5 border-t border-gray-200 dark:border-white/10' : 'hidden'} md:block md:mt-5 md:pt-5 md:border-t md:border-gray-200 dark:md:border-white/10`}>
                
                {/* Location Search Bar */}
                <div className="mb-7">
                    <h2 className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-widest">Location</h2>
                    <form onSubmit={handleLocationSearch} className="relative">
                        <input
                            type="text"
                            placeholder="e.g. Bangalore, Delhi..."
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {filterData.map((data, index) => (
                    <div key={index} className="mb-7">
                        <h2 className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-widest">{data.filterType}</h2>
                        <div className="flex flex-col gap-3">
                            {data.array.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name={data.filterType} 
                                        onChange={() => changeHandler(data.type, item)}
                                        checked={isChecked(data.type, item)}
                                        className="w-4 h-4 text-blue-600 bg-white dark:bg-[#121212] border-gray-300 dark:border-white/20 focus:ring-blue-500/50 cursor-pointer accent-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterSidebar;
