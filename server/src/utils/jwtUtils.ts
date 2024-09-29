import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const generateToken = (userId: string, roles: string[]) => {
  return jwt.sign({ userId, roles }, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
