const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let cachedConnection = null;

const getDatabaseErrorMessage = (error) => {
  if (!process.env.MONGO_URI) {
    return 'MONGO_URI is not configured in the backend environment variables';
  }

  if (error?.name === 'MongooseServerSelectionError') {
    return 'MongoDB server selection failed. Check your Atlas network access and connection string';
  }

  if (error?.message?.toLowerCase().includes('authentication failed')) {
    return 'MongoDB authentication failed. Check the username and password in MONGO_URI';
  }

  return 'Database connection failed';
};

// Optimize MongoDB connection for Vercel's serverless environment
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI');
  }

  if (cachedConnection) {
    await cachedConnection;
    return;
  }

  try {
    cachedConnection = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging for 10s-30s
    });

    await cachedConnection;
    console.log('MongoDB Connected!');
  } catch (err) {
    cachedConnection = null;
    console.error('MongoDB Connection Error:', err.message);
    throw err;
  }
};

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({
      success: true,
      message: 'Backend and database are connected',
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getDatabaseErrorMessage(error),
      database: 'not connected',
    });
  }
});

// Ensure DB is connected before handling data API requests
app.use('/api/data', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getDatabaseErrorMessage(error),
    });
  }
});

// Connect our routes
const dataRoutes = require('./routes/dataRoutes');
app.use('/api/data', dataRoutes);

const PORT = process.env.PORT || 5000;

// Only listen on a port if we are not in Vercel's serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express API for Vercel's serverless environment
module.exports = app;
