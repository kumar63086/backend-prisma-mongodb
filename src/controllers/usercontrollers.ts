import { Request, Response, NextFunction } from 'express';
import prisma from '../models/prisma'; // Ensure this points to the correct Prisma instance
import bcrypt from 'bcrypt';
import cookieToken from '../utils/cookiestoken'; // Ensure this is the correct path and extension

// User signup
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Please provide all fields' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in the database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Send user token in a cookie
        cookieToken(newUser, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// User login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide email and password' });
            return;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // User not found
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Password is incorrect' });
            return;
        }

        // Send user token in a cookie
        cookieToken(user, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// User logout
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Clear the cookie
        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};
