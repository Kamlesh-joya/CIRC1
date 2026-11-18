import dotenv from 'dotenv';
dotenv.config();

export const APP_CONFIG = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'circuitcare_super_secure_jwt_secret_key_jaipur_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};

export default APP_CONFIG;
