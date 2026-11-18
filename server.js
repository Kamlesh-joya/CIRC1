/**
 * CircuitCare Hostinger Root Entry Point
 * Hostinger Node.js Application Startup File
 */
import { app, startServer } from './backend/server.js';

const PORT = process.env.PORT || 5000;
startServer(PORT);

export { app, startServer };
export default app;
