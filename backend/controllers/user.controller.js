import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // 1. Validation: Ensure no fields are empty
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ success: false, message: "Something is missing" });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists with this email." });
        }

        // 3. Hash the Password (Security Best Practice)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create the new user in MongoDB
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ success: true, message: "Account created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: "Something is missing" });
        }

        // 1. Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Incorrect email or password." });
        }

        // 2. Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect email or password." });
        }

        // 3. Ensure role matches
        if (role !== user.role) {
            return res.status(400).json({ success: false, message: "Account doesn't exist with current role." });
        }

        // 4. Generate JWT Token & Cookie
        generateToken(res, user);

        // Clean user object before sending to frontend (DON'T send password!)
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        // Clearing the cookie logs the user out
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const userId = req.id; // from isAuthenticated middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        // Updating basic data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        
        // Handle skills (split by comma if provided)
        if (skills !== undefined) {
            const skillsArray = skills.split(",").map(skill => skill.trim()).filter(Boolean);
            user.profile.skills = skillsArray;
        }

        if (bio !== undefined) user.profile.bio = bio;

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto" // Automatically handles raw files like PDFs
            });
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = req.file.originalname;
        }

        await user.save();

        // format updated user object
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
