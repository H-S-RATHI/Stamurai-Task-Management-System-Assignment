import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications - Return empty array for now
router.get('/', authenticateToken, async (req, res) => {
  res.json([]);
});

export default router; 