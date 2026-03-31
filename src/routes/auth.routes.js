import express from 'express';
import {
  register,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getMe,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password/:token', resetPassword);

// Protected route - requires valid JWT
router.get('/me', protect, getMe);

export default router;
