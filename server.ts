import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projects';
import ticketRoutes from './routes/ticket';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://issue-tracker-frontend-k6ad.vercel.app'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Ensure preflight requests are handled
app.options("*", cors());

app.use(express.json());

// Debug middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Incoming Request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);
console.log('Routes registered');

// 404 Handler
app.use((req: Request, res: Response) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => console.log('MongoDB Atlas connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Ping route
app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
