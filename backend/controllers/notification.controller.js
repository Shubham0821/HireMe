import { Notification } from "../models/notification.model.js";

// Get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ recipient: userId })
            .populate({
                path: 'relatedId',
                populate: { path: 'created_by', select: 'fullname email' }
            })
            .populate('sender', 'fullname profile role')
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        return res.status(200).json({ success: true, notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Mark all notifications as read for the user
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.id;
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
