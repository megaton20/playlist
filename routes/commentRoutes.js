// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:playlistId', commentController.addComment);
router.get('/:playlistId', commentController.getComments);

module.exports = router;
