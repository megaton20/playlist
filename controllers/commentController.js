const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const comment = await Comment.addComment({
      userId: req.user.id,
      playlistId: req.params.playlistId,
      content,
      parentId
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const thread = await Comment.getThread(req.params.playlistId);
    res.json(thread);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
