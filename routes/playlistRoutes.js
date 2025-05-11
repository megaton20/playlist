
// routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/', playlistController.create);
router.get('/trending', playlistController.trending);
router.get('/:id', playlistController.getOne);
router.post('/:id/like', playlistController.like);
router.post('/:id/unlike', playlistController.unlike);

module.exports = router;
