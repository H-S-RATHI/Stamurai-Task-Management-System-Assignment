import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import prisma from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'ok', db: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Backend API is running');
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
}); 