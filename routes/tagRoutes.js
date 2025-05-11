// routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/', tagController.getAll);
router.get('/feed', tagController.feed);

module.exports = router;
