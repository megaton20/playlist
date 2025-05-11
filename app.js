// server.js
const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');
require('./passport'); // Initialize Passport strategies

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
