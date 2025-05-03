import express from 'express';
import registerRouter from './register.js';
import authRouter from './auth.js';
import tasksRouter from './tasks.js';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/', authRouter);
router.use('/tasks', tasksRouter);

export default router; 