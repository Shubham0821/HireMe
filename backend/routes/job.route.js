import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, deleteJob } from "../controllers/job.controller.js";

const router = express.Router();

// A user/admin MUST be logged in to access these routes (Hence, isAuthenticated middleware)
router.post("/post", isAuthenticated, postJob);
router.get("/get", getAllJobs);
router.get("/getadminjobs", isAuthenticated, getAdminJobs);
router.get("/get/:id", getJobById); // Public — anyone can view job details
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);

export default router;
