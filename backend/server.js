// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

/* ------------------- MIDDLEWARE ------------------- */

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

/* ------------------- ROUTES ------------------- */

app.use('/api/merch', require('./routes/merchRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

/* ------------------- ERROR HANDLING ------------------- */

// Centralized error handler (fallback)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

/* ------------------- MONGODB CONNECTION ------------------- */

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/50cube';
const PORT = process.env.PORT || 8000;

//  for local development
// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // Add more options as needed
//   })
//   .then(() => {
//     console.log('✅ Connected to MongoDB');

//     // Start Express server after DB connection
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection failed:', err.message);
//     process.exit(1); // Exit process with failure
//   });

//  for vercel deployment
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ✅ Export the handler for Vercel
module.exports = app;
