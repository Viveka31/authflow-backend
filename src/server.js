import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Render health checks, curl, Postman)
    if (!origin) return callback(null, true);

    // Always allow localhost for local dev
    if (origin.includes('localhost')) return callback(null, true);

    // Allow any Vercel deployment URL (main + all preview URLs)
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Allow any Netlify deployment URL
    if (origin.endsWith('.netlify.app')) return callback(null, true);

    // Allow explicitly set CLIENT_URL (comma-separated list supported)
    const allowed = (process.env.CLIENT_URL || '').split(',').map(o => o.trim());
    if (allowed.includes(origin)) return callback(null, true);

    // Block everything else
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});