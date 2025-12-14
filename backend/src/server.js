// IMPORTANT: Load .env FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Now import everything else AFTER dotenv is configured
import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import tableRoutes from './routes/tables.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes from './routes/payment.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FoodOrder API is running' });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please:`);
        console.error(`   1. Kill the process: lsof -ti:${PORT} | xargs kill -9`);
        console.error(`   2. Or change PORT in .env file`);
        process.exit(1);
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

export default app;

