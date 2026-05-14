const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Optimize MongoDB connection for Vercel's serverless environment
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging for 10s-30s
    });
    console.log('MongoDB Connected!');
  } catch (err) {
    console.log('MongoDB Connection Error:', err);
  }
};

// Ensure DB is connected before handling any API requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Connect our routes
const dataRoutes = require('./routes/dataRoutes');
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express API for Vercel's serverless environment
module.exports = app;