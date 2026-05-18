import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel: {
        type: Number, // Years of experience
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true // e.g., "Full-time", "Part-time"
    },
    category: {
        type: String,
        default: "" // e.g., "Frontend", "Backend", "Data Science"
    },
    // Legacy fields for old data
    jobTitle: {
        type: String
    },
    noOfPositions: {
        type: Number
    },
    position: {
        type: Number,
        required: true // Number of positions available
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Assuming we have a Company model, or we can just store the String if simple
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Recruiter who posted the job
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }
    ]
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
