import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a type for the payload
interface TokenPayload extends JwtPayload {
    userId: string;
}

const getJwtToken = (userId: string): string => {
    const payload: TokenPayload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1 day' });
};

export default getJwtToken;
