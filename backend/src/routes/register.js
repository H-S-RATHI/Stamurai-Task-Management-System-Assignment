import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const router = express.Router();

const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

router.post('/', async (req, res) => {
  try {
    const body = userSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser) {
      return res.status(409).send('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: (await prisma.user.count()) === 0 ? 'ADMIN' : 'USER',
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal error');
  }
});

export default router; 