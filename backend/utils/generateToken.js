import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
    // 1. Create the payload (what data we want inside the token)
    const payload = {
        userId: user._id,
        role: user.role
    };

    // 2. Generate the token with our secret key
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expires in 1 day
    });

    // 3. Store the token in a secure HTTP-Only cookie
    res.cookie('token', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
        httpOnly: true, // Prevents Javascript (Hackers) from reading it
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        secure: process.env.NODE_ENV === 'production'
    });

    return token;
};
