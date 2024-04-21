import bcrypt from 'bcryptjs';
import UserModel from '../model/Usermodel.js';

const cookiesExpireTime = 7;

export const register = async (req, res, next) => {
    try {
        const { username, email, password, avatar } = req.body;
        const hash = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const user = await UserModel.create({ username, email, password: hash, avatar });

        // Generate JWT token for the user
        const token = user.getJwtToken();

        // Settings for cookies
        const options = {
            expires: new Date(Date.now() + cookiesExpireTime * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        // Send response with user data and token
        res.cookie('token', token, options).status(200).json({
            success: true,
            message: "User registration successful",
            user,
            token
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password"
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Passwords match, send success response
        res.status(200).json({
            success: true,
            message: "User login successful",
            user
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getallusers = async (req, res) => {
    try {
        // Get all users from the database
        const users = await UserModel.find();
        if (!users.length) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }

        // Send response with all users
        res.status(200).json({
            success: true,
            message: "All users in database",
            users
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const logout = (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        success: true,
        message: 'Logout'
    });
};

