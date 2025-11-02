// Main Express Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pdfRoutes from './routes/pdf.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
     origin: [
       'http://localhost:5500',
       'http://127.0.0.1:5500',
       'https://saharansub.netlify.app/flag-football-platform/'  // Your Netlify URL
     ],
     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Flag Football Backend'
  });
});

// API Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Flag Football Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      pdf: '/api/pdf/*',
      admin: '/api/admin/*'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('Flag Football Backend Server');
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('=================================');
});

export default app;