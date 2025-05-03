import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.error(`No token provided in Authorization header for ${req.method} ${req.originalUrl}`);
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(`JWT verification error for ${req.method} ${req.originalUrl}:`, err);
      console.error('Token received:', token);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
} 