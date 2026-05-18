import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.receiverId;
        const { text, jobId } = req.body;

        if (!text) return res.status(400).json({ success: false, message: "Text is required." });

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            jobId,
            text
        });

        const sender = await User.findById(senderId).select('fullname');
        
        // Create notification for receiver (wrapped in try-catch to not block message delivery)
        try {
            await Notification.create({
                recipient: receiverId,
                sender: senderId,
                message: `${sender.fullname} sent you a message: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
                type: 'new_message'
            });
        } catch (notificationError) {
            console.error("Notification failed but message was sent:", notificationError);
        }

        return res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getConversation = async (req, res) => {
    try {
        const userId = req.id;
        const otherUserId = req.params.otherUserId;

        // Mark messages as read
        await Message.updateMany(
            { sender: otherUserId, receiver: userId, isRead: false },
            { isRead: true }
        );

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getMyContacts = async (req, res) => {
    try {
        const userId = req.id;
        
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate('sender', 'fullname email profile.profilePhoto')
          .populate('receiver', 'fullname email profile.profilePhoto')
          .sort({ createdAt: -1 });

        const contactsMap = new Map();
        
        messages.forEach(msg => {
            const isSender = msg.sender._id.toString() === userId.toString();
            const contact = isSender ? msg.receiver : msg.sender;
            
            if (!contactsMap.has(contact._id.toString())) {
                contactsMap.set(contact._id.toString(), {
                    user: contact,
                    lastMessage: msg.text,
                    timestamp: msg.createdAt,
                    unread: !isSender && !msg.isRead ? 1 : 0
                });
            } else {
                if (!isSender && !msg.isRead) {
                    const existing = contactsMap.get(contact._id.toString());
                    existing.unread += 1;
                }
            }
        });

        return res.status(200).json({ success: true, contacts: Array.from(contactsMap.values()) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
