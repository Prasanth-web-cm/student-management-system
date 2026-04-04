const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Try to load .env only if not already in production/Render
if (process.env.NODE_ENV !== 'production' && fs.existsSync(path.join(__dirname, '.env'))) {
    dotenv.config({ path: path.join(__dirname, '.env') });
}
// Note: Render sets environment variables directly in the process, which take precedence.

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Routes
app.get('/', (req, res) => {
  res.send('Student Management System Backend is running');
});

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const markRoutes = require('./routes/marks');
const attendanceRoutes = require('./routes/attendance');
const quizRoutes = require('./routes/quizzes');
const exportRoutes = require('./routes/export');
const mlRoutes = require('./routes/mlRoutes');

// Base route test
app.get('/api/status', (req, res) => {
    res.json({ status: 'API is running' });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/ml', mlRoutes);

// --- START: SERVE FRONTEND STATIC FILES ---
// Note: This works in production if you run 'npm run build' in the frontend folder first.
const frontendFolder = path.join(__dirname, '..', 'frontend', 'dist');

if (fs.existsSync(frontendFolder)) {
    // Serve any static files (like JS, CSS, images) from the 'dist' folder
    app.use(express.static(frontendFolder));

    // For any request that doesn't match an API route or a static file,
    // send back the index.html from the frontend folder.
    // This supports client-side routing on page refresh.
    app.get('/*splat', (req, res) => {
        // Exclude /api routes from being caught here for debugging clarity
        if (!req.url.startsWith('/api/')) {
            res.sendFile(path.resolve(frontendFolder, 'index.html'));
        } else {
            res.status(404).json({ error: 'API route not found' });
        }
    });
} else {
    console.warn(`WARNING: Frontend build folder not found at ${frontendFolder}. Check if frontend has been built.`);
}
// --- END: SERVE FRONTEND STATIC FILES ---

// Import routes later

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-management';

console.log('Using MongoDB URI from env:', !!process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.warn('WARNING: Using fallback local MongoDB URI. Render should set MONGO_URI env var.');
}

// Start the server immediately so Render doesn't timeout
// Use '0.0.0.0' to ensure it listens on all available interfaces (IPv4 and IPv6)
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/api/status`);
});

// Robust Error Handling for the process
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

// Connect to MongoDB asynchronously with a timeout
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.warn('The server is still running, but database operations will fail until connection is restored.');
    console.warn('Check your MONGO_URI and ensure your IP is whitelisted in MongoDB Atlas.');
  });
