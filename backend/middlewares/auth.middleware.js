import { UserModel } from '../models/User.model.js';

export function authMiddleware(req, res, next) {
  let token = null;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Check Cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    const decoded = UserModel.verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in or create an account to proceed with your service enquiry.'
    });
  }
  next();
}

export default authMiddleware;
