import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/tasks/assigned
router.get('/assigned', authenticateToken, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { assigneeId: req.user.id },
    orderBy: { dueDate: 'asc' },
    include: { creator: true },
  });
  res.json(tasks);
});

// GET /api/tasks/created
router.get('/created', authenticateToken, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { creatorId: req.user.id },
    orderBy: { dueDate: 'asc' },
    include: { assignee: true },
  });
  res.json(tasks);
});

// GET /api/tasks/overdue
router.get('/overdue', authenticateToken, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: req.user.id,
      dueDate: { lt: new Date() },
      status: { not: 'COMPLETED' },
    },
    orderBy: { dueDate: 'asc' },
    include: { creator: true },
  });
  res.json(tasks);
});

export default router; 