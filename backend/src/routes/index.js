import express from 'express';
import registerRouter from './register.js';
import authRouter from './auth.js';
import tasksRouter from './tasks.js';
import usersRouter from './users.js';
import notificationsRouter from './notifications.js';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/', authRouter);
router.use('/tasks', tasksRouter);
router.use('/users', usersRouter);
router.use('/notifications', notificationsRouter);

export default router; 