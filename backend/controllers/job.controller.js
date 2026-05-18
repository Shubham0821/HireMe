import { Job } from "../models/job.model.js";

// Admin/Recruiter creates a job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyId } = req.body;
        const userId = req.id; // From our isAuthenticated middleware!

        if (!title || !description || !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId) {
            return res.status(400).json({ success: false, message: "Something is missing." });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","), // String to array
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experienceLevel),
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({ success: true, message: "New job posted successfully.", job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// User gets all jobs (with Search/Filter functionality!)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const minSalary = req.query.minSalary ? Number(req.query.minSalary) : null;
        const maxSalary = req.query.maxSalary ? Number(req.query.maxSalary) : null;
        const location = req.query.location || "";

        const query = {};

        // Keyword search across: title, jobTitle, category, description, location, jobType
        if (keyword) {
            const words = keyword.trim().split(/\s+/).filter(w => w.length > 0);
            
            const andConditions = words.map(word => {
                const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Use word boundaries \b to prevent partial matches (e.g., "Data" matching "database")
                const regexPattern = `\\b${escaped}\\b`;
                return {
                    $or: [
                        { title:       { $regex: regexPattern, $options: "i" } },
                        { jobTitle:    { $regex: regexPattern, $options: "i" } },
                        { category:    { $regex: regexPattern, $options: "i" } },
                        { description: { $regex: regexPattern, $options: "i" } },
                        { location:    { $regex: regexPattern, $options: "i" } },
                        { jobType:     { $regex: regexPattern, $options: "i" } }
                    ]
                };
            });
            
            if (andConditions.length === 1) {
                Object.assign(query, andConditions[0]);
            } else {
                query.$and = andConditions;
            }
        }

        // Separate location filter (from sidebar)
        if (location) {
            const locRegex = { $regex: location, $options: "i" };
            if (query.$and) {
                query.$and.push({ $or: [{ location: locRegex }] });
            } else {
                query.location = locRegex;
            }
        }

        // Salary range filter
        if (minSalary !== null || maxSalary !== null) {
            query.salary = {};
            if (minSalary !== null) query.salary.$gte = minSalary;
            if (maxSalary !== null) query.salary.$lte = maxSalary;
        }

        // Fetch all, populate what we can (some old docs may not have refs)
        const jobs = await Job.find(query)
            .populate({ path: "company", strictPopulate: false })
            .populate({ path: "created_by", select: "-password", strictPopulate: false })
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, jobs: jobs || [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// User gets details of 1 specific job
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id; // Extract ID from URL
        const job = await Job.findById(jobId)
            .populate({ path: "applications" })
            .populate({ path: "company", strictPopulate: false });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        return res.status(200).json({ success: true, job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Admin gets jobs they specifically posted
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate('company');

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, message: "Jobs not found." });
        }
        
        return res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Admin updates a job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const updates = req.body;

        const job = await Job.findByIdAndUpdate(jobId, updates, { new: true });
        
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        return res.status(200).json({ success: true, message: "Job updated successfully.", job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Admin deletes a job
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        return res.status(200).json({ success: true, message: "Job deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
