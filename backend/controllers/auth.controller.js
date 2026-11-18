import { UserModel } from '../models/User.model.js';
import { APP_CONFIG } from '../config/app.config.js';

export const authController = {
  /**
   * POST /api/auth/signup
   * Full Name, Email, Mobile number, Password
   */
  async signup(req, res, next) {
    try {
      const { fullName, email, phone, password } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ success: false, message: 'Full name is required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Valid email address is required' });
      }

      const cleanPhone = (phone || '').toString().replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number is required' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }

      const user = await UserModel.create({ fullName, email, phone, password });
      const token = UserModel.generateToken(user);

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: APP_CONFIG.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: APP_CONFIG.cookieMaxAge
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user,
          token
        }
      });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return next(err);
    }
  },

  /**
   * POST /api/auth/login
   * Email, Password
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const userRecord = await UserModel.findByEmail(email);
      if (!userRecord) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await UserModel.verifyPassword(password, userRecord.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const { passwordHash: _, ...user } = userRecord;
      const token = UserModel.generateToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        secure: APP_CONFIG.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: APP_CONFIG.cookieMaxAge
      });

      return res.json({
        success: true,
        message: 'Signed in successfully',
        data: {
          user,
          token
        }
      });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * GET /api/auth/me
   * Returns current authenticated customer profile
   */
  async getMe(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const userRecord = await UserModel.findById(req.user.id);
      if (!userRecord) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const { passwordHash: _, ...user } = userRecord;
      return res.json({
        success: true,
        data: { user }
      });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout(req, res) {
    res.clearCookie('token');
    return res.json({
      success: true,
      message: 'Signed out successfully'
    });
  },

  /**
   * PUT /api/auth/profile
   * Secure profile update enforcing authenticated session ownership
   */
  async updateProfile(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { fullName, phone, address, locality, city, pincode } = req.body;
      const updatedUser = await UserModel.updateProfile(req.user.id, {
        fullName,
        phone,
        address,
        locality,
        city,
        pincode
      });

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return next(err);
    }
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required' });
      }

      const resetData = await UserModel.createPasswordResetToken(email);
      if (resetData) {
        console.log(`[Password Reset] Generated reset token for ${email}: ${resetData.token}`);
      }

      return res.json({
        success: true,
        message: 'If that email address is registered, password reset instructions have been generated.',
        data: process.env.NODE_ENV !== 'production' && resetData ? { resetToken: resetData.token } : undefined
      });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ success: false, message: 'Token and new password are required' });
      }

      await UserModel.resetPasswordWithToken(token, password);

      return res.json({
        success: true,
        message: 'Password has been reset successfully. You can now sign in with your new password.'
      });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      return next(err);
    }
  }
};

export default authController;
