import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 5000;
const DB_URL = 'mongodb://127.0.0.1:27017/feedback_system';

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'superSecretKey!@#456',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000 
  },
}));

// Serve uploaded images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

// Connect to MongoDB and start server
mongoose.connect(DB_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
  });