import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../config/app.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export class UserModel {
  static _readUsers() {
    try {
      if (!fs.existsSync(USERS_FILE)) return [];
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (err) {
      console.error('[UserModel] Error reading users file:', err);
      return [];
    }
  }

  static _writeUsers(users) {
    try {
      const tempFile = `${USERS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), 'utf-8');
      fs.renameSync(tempFile, USERS_FILE);
    } catch (err) {
      console.error('[UserModel] Error writing users file:', err);
      throw new Error('Database write failure');
    }
  }

  static async findByEmail(email) {
    if (!email) return null;
    const users = this._readUsers();
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  static async findById(id) {
    if (!id) return null;
    const users = this._readUsers();
    return users.find((u) => u.id === id) || null;
  }

  static async create({ fullName, email, phone, password }) {
    const existing = await this.findByEmail(email);
    if (existing) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'USR-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      passwordHash,
      createdAt: new Date().toISOString()
    };

    const users = this._readUsers();
    users.push(newUser);
    this._writeUsers(users);

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  static async verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone
      },
      APP_CONFIG.jwtSecret,
      { expiresIn: APP_CONFIG.jwtExpiresIn }
    );
  }

  static async updateProfile(userId, allowedFields) {
    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      throw err;
    }
    const users = this._readUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const user = users[index];

    // Explicitly allowed fields only - never accept passwordHash, id, role or unverified email mutation
    if (typeof allowedFields.fullName === 'string' && allowedFields.fullName.trim()) {
      user.fullName = allowedFields.fullName.trim();
    }
    if (typeof allowedFields.phone === 'string' && allowedFields.phone.trim()) {
      const cleanPhone = allowedFields.phone.replace(/\D/g, '');
      if (cleanPhone.length >= 10) {
        user.phone = cleanPhone.slice(-10);
      }
    }
    if (typeof allowedFields.address === 'string') {
      user.address = allowedFields.address.trim();
    }
    if (typeof allowedFields.locality === 'string') {
      user.locality = allowedFields.locality.trim();
    }
    if (typeof allowedFields.city === 'string') {
      user.city = allowedFields.city.trim() || 'Jaipur';
    }
    if (typeof allowedFields.pincode === 'string') {
      user.pincode = allowedFields.pincode.trim();
    }
    user.updatedAt = new Date().toISOString();

    users[index] = user;
    this._writeUsers(users);

    const { passwordHash: _, resetPasswordToken: _t, resetPasswordExpires: _e, ...safeUser } = user;
    return safeUser;
  }

  static async createPasswordResetToken(email) {
    if (!email) return null;
    const users = this._readUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return null;

    // Generate random secure token & 1-hour expiry
    const resetToken = 'RST-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    this._writeUsers(users);

    return { token: resetToken, email: user.email, fullName: user.fullName };
  }

  static async resetPasswordWithToken(token, newPassword) {
    if (!token || !newPassword || newPassword.length < 6) {
      const err = new Error('Valid token and password of at least 6 characters are required');
      err.statusCode = 400;
      throw err;
    }

    const users = this._readUsers();
    const user = users.find(
      (u) => u.resetPasswordToken === token && new Date(u.resetPasswordExpires) > new Date()
    );

    if (!user) {
      const err = new Error('Password reset token is invalid or has expired');
      err.statusCode = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    user.updatedAt = new Date().toISOString();

    this._writeUsers(users);
    return true;
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, APP_CONFIG.jwtSecret);
    } catch (err) {
      return null;
    }
  }
}

export default UserModel;
