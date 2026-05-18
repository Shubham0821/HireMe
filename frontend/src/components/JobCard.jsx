import React from 'react';
import { Bookmark, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';

const JobCard = ({ job }) => {
    const navigate = useNavigate();
    
    const jobId = job?._id || "123";
    // Support both old schema (company as string) and new schema (company as object)
    const companyName = job?.company?.name || job?.company || "Tech Solutions Ltd";
    // Support both old schema (jobTitle) and new schema (title)
    const jobTitle = job?.title || job?.jobTitle || "Senior Frontend Developer";
    const location = job?.location || "Bangalore, IN";
    const description = job?.description || "We are looking for a highly skilled developer.";
    // Support both old (noOfPositions) and new (position) schema
    const position = job?.position || job?.noOfPositions || 1;
    const jobType = job?.jobType || "Full Time";
    const salary = job?.salary || 12;

    const daysAgo = Math.floor(Math.random() * 10) + 1; 

    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.1}
            glareColor="#818CF8"
            glarePosition="all"
            glareBorderRadius="1rem"
            tiltMaxAngleX={4}
            tiltMaxAngleY={4}
            transitionSpeed={2000}
            scale={1.02}
            className="h-full transform-gpu"
        >
            <div className="h-full flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E1E1E]/80 backdrop-blur-md shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-md dark:hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] transition-shadow duration-300 group">
            
            <div className="flex justify-between items-center mb-5">
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/5">{daysAgo} days ago</p>
                <button className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30">
                    <Bookmark className="h-5 w-5" />
                </button>
            </div>

            <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-[#1E1E1E] border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shadow-inner">
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl drop-shadow-md">{companyName.charAt(0)}</span>
                </div>
                <div>
                    <h2 className="font-bold text-xl text-gray-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-wide">{companyName}</h2>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-sm font-medium mt-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        {location}
                    </div>
                </div>
            </div>

            <h1 className="font-bold text-2xl mb-3 text-gray-900 dark:text-white tracking-tight drop-shadow-sm">{jobTitle}</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed font-light">
                {description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2.5 mb-8 mt-auto">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 shadow-sm">{position} Positions</span>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm">{jobType}</span>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-sm">{salary}LPA</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4">
                <button onClick={() => navigate(`/description/${jobId}`)} className="flex-1 py-3 font-semibold border border-gray-300 dark:border-blue-500/30 text-gray-700 dark:text-blue-300 rounded-xl hover:bg-gray-100 dark:hover:bg-blue-500/10 hover:border-gray-400 dark:hover:border-blue-400 transition-all shadow-sm">
                    Details
                </button>
                <button className="flex-1 py-3 font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all shadow-md tracking-wide">
                    Save For Later
                </button>
            </div>
            </div>
        </Tilt>
    );
};

export default JobCard;
