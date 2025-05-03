import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import cors from 'cors';

const router = express.Router();

// Log every request to this router
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

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

// GET /api/tasks
router.get('/', authenticateToken, async (req, res) => {
  const { status, priority, search } = req.query;

  // Build the where clause dynamically
  const where = {
    OR: [
      { creatorId: req.user.id },
      { assigneeId: req.user.id },
    ],
    ...(status && status !== 'ALL' ? { status } : {}),
    ...(priority && priority !== 'ALL' ? { priority } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { dueDate: 'asc' },
    include: { creator: true, assignee: true },
  });
  res.json(tasks);
});

// POST /api/tasks
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assigneeId } = req.body;
    if (!title || !status || !priority || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: new Date(dueDate),
        creatorId: req.user.id,
        assigneeId: assigneeId || null,
      },
      include: { creator: true, assignee: true },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 