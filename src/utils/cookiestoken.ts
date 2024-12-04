import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../type/userTypes';

const getJwtToken = (userId: string): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const cookieToken = (user: User, res: Response): void => {
    const token = getJwtToken(user.id);

    const options: { expires: Date; httpOnly: boolean; secure: boolean; sameSite: 'strict' } = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    // Create a new user object without the password
    const { password, ...userWithoutPassword } = user;

    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user: userWithoutPassword,
    });
};

export default cookieToken;
