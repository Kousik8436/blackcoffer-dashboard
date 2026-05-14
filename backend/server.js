const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('Error:', err));

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