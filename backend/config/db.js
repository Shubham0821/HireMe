import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // connect to the mongoDB URI stored in our .env file!
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // 1 means exit with failure
    }
};

export default connectDB;
