const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const departmentRoutes = require('./routes/department.routes');
const hodRoutes = require('../routes/hod.routes');
const locationRoutes = require('./routes/location.routes');
const metadataRoutes = require('./routes/metadata.routes');
const rtiRoutes = require('./routes/rti.routes');

const app = express();

// Security Middleware
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api', departmentRoutes);
app.use('/api', locationRoutes);
app.use('/api', metadataRoutes);
app.use('/api/rti', rtiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
