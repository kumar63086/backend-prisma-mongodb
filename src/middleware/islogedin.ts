import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../models/prisma';

interface JwtPayload {
    userId: string;
}

const isLoggedIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ message: 'Please log in to access this resource.' });
            return;
        }

        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // Find the user in the database
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Attach user to the request object for downstream middleware/handlers
        (req as any).user = user;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
};

export default isLoggedIn;
