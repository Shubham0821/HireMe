import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoute from './routes/user.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';
import companyRoute from './routes/company.route.js';
import notificationRoute from './routes/notification.route.js';
import messageRoute from './routes/message.route.js';

// Load environment variables from .env file
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Trust proxy is needed if you are hosting on Render/Heroku/Vercel etc. to allow secure cookies
app.set("trust proxy", 1);

// 1. express.json() allows us to read JSON data from the frontend
app.use(express.json());
// 2. cookieParser() allows us to read secure cookies (for JWT Auth later)
app.use(cookieParser());
// 3. cors() allows our frontend (which runs on a different port) to talk to the backend
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
    ].filter(Boolean),
    credentials: true, // Allow passing tokens/cookies back and forth
};
app.use(cors(corsOptions));
// Serve uploads folder statically so frontend can access images/pdfs by URL
app.use('/uploads', express.static('uploads'));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/message", messageRoute);

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Job Portal Backend is running successfully!');
});

// Start the server
app.listen(PORT, () => {
    connectDB(); // Connect to Database before server fully starts
    console.log(`Server is running at http://localhost:${PORT}`);
});
