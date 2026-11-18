import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { APP_CONFIG } from './config/app.config.js';
import { BRAND_CONFIG } from './config/brand.config.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import enquiryRoutes from './routes/enquiry.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Middlewares
app.use(cors({
  origin: process.env.APP_ORIGIN ? [process.env.APP_ORIGIN, 'https://circuitcare.co.in', true] : true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);

// Dynamic frontend dist path resolution for both local and Hostinger production
const possibleDistPaths = [
  path.join(__dirname, '../dist'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, 'frontend/dist')
];
const frontendDist = possibleDistPaths.find((p) => fs.existsSync(p)) || path.join(__dirname, '../frontend/dist');

// Serve static build assets
app.use(express.static(frontendDist));
if (fs.existsSync(path.join(frontendDist, 'assets'))) {
  app.use('/assets', express.static(path.join(frontendDist, 'assets')));
} else if (fs.existsSync(path.join(__dirname, '../frontend/public/assets'))) {
  app.use('/assets', express.static(path.join(__dirname, '../frontend/public/assets')));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', catalogRoutes);
app.use('/api/enquiry', enquiryRoutes);

// Brand & Info API
app.get('/api/brand', (req, res) => {
  res.json({
    success: true,
    data: BRAND_CONFIG
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CircuitCare Jaipur API',
    time: new Date().toISOString()
  });
});

// SPA Fallback for client routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>CircuitCare API</title></head>
          <body style="font-family: sans-serif; background: #0D0F0D; color: #FEFAF7; padding: 2rem;">
            <h1 style="color: #BBFA47;">CircuitCare Jaipur Backend Server Running</h1>
            <p>API endpoints are live under <code>/api</code>.</p>
          </body>
        </html>
      `);
    }
  });
});

// Centralized error handler
app.use(errorHandler);

// Helper to start HTTP listener on 0.0.0.0 for Hostinger / cloud containers
export function startServer(port = process.env.PORT || APP_CONFIG.port) {
  const serverPort = Number(port) || 5000;
  return app.listen(serverPort, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`⚡ CircuitCare Jaipur Server running on 0.0.0.0:${serverPort}`);
    console.log(`🌐 API Endpoint: http://localhost:${serverPort}/api`);
    console.log(`📱 WhatsApp Number: ${BRAND_CONFIG.businessPhone}`);
    console.log(`===============================================`);
  });
}

// Start server if directly executed
const entryFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
const thisFile = fileURLToPath(import.meta.url);
const isMain = entryFile === thisFile;

if (isMain) {
  startServer();
}

export default app;
