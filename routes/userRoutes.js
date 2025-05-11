// routes/userRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', passport.authenticate('local'), userController.login);
router.post('/logout', userController.logout);
router.get('/me', userController.getMe);
router.get('/:id', userController.getProfile);

module.exports = router;
