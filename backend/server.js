import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
import feedbackRoutes from "./routes/feedbackRoutes.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Read frontend origins from .env (comma-separated)
// const frontendEnv = process.env.FRONTEND_URL || 'http://localhost:5173';
// const allowedOrigins = frontendEnv
//   .split(',')
//   .map(u => u.trim())
//   .filter(Boolean);

// console.log("RESEND KEY:", process.env.RESEND_API_KEY);


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://learnilmworld.onrender.com",
  "https://learnilmworld.onrender.com/api",
  "https://www.learnilmworld.com",
  "https://learn-ilm-world.vercel.app",
  process.env.FRONTEND_URL,  //  deployed frontend (e.g., https://learnosphere.vercel.app)
].filter(Boolean); // removes undefined

// Middleware - robust CORS using env variable
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., curl, server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'), false);
  },
  credentials: true
}));

//  Allow Google OAuth popups / iframes
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/courses', courseRoutes);


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Handle CORS origin errors
  if (err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
