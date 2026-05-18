import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";

// User applies to a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id; // Usually we do /api/application/apply/:id

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID not found." });
        }

        // 1. Prevent duplicate applications
        // Find if this exact user already applied to this exact job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied for this job." });
        }

        // 2. Check if the job actually exists before creating an application
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        // 3. Create the new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            // status defaults to 'pending' as defined in our schema!
        });

        // 4. Update the Job array to include this new application ID
        // Use findByIdAndUpdate to bypass validation for old job docs missing required fields
        await Job.findByIdAndUpdate(jobId, {
            $push: { applications: newApplication._id }
        });

        // 5. Create notification for recruiter (only if job has a recruiter reference)
        const jobTitle = job.title || job.jobTitle || 'a job';
        if (job.created_by) {
            await Notification.create({
                recipient: job.created_by,
                sender: userId, // The student who applied
                message: `A new candidate applied for your job: ${jobTitle}`,
                type: 'new_application',
                relatedId: job._id
            });
        }

        return res.status(201).json({ success: true, message: "Job applied successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// User gets the list of jobs THEY applied to
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        // Find applications by this user
        // We use nested populate to get the full Job details, and inside that, the Company details!
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company'
                }
            });

        if (!applications || applications.length === 0) {
            return res.status(200).json({ success: true, applications: [] });
        }

        return res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Admin gets all applicants for a specific job they posted
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Get the job and populate the applicants inside the applications array
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
                select: '-password' // Never expose the applicant password to the admin!
            }
        });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        // Ensure applications is at least an empty array for old documents
        if (!job.applications) job.applications = [];

        return res.status(200).json({ success: true, job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Admin updates the status of an application (Accepted/Rejected)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required." });
        }

        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        // Update the status and save
        application.status = status.toLowerCase(); // keep it consistent!
        await application.save();

        // Create notification for applicant
        const job = await Job.findById(application.job);
        if (job) {
            const jobTitle = job.title || job.jobTitle || 'a job';
            await Notification.create({
                recipient: application.applicant,
                sender: req.id, // The recruiter who updated status
                message: `Your application for ${jobTitle} has been ${application.status}`,
                type: 'application_status',
                relatedId: job._id
            });
        }

        return res.status(200).json({ success: true, message: "Application status updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
