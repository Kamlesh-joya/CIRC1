/**
 * CircuitCare Hostinger Root Entry Point
 * Hostinger Node.js Application Startup File
 */
import { app } from './backend/server.js';

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`⚡ CircuitCare Jaipur Server running on 0.0.0.0:${port}`);
  console.log(`🌐 Ready for traffic`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CircuitCare] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[CircuitCare] Uncaught Exception:', err);
});

export { app, server };
export default app;
