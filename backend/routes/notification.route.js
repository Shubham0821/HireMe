import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAllAsRead, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getNotifications);
router.route("/mark-read/:id").put(isAuthenticated, markAsRead);
router.route("/mark-all-read").put(isAuthenticated, markAllAsRead);

export default router;
