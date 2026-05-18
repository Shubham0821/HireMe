import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['application_status', 'new_application', 'system'], 
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
        // Can be jobId or applicationId depending on context
    },
    isRead: {
        type: Boolean,
        default: false
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
