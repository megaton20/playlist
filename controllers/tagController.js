const Tag = require('../models/Tag');

exports.getAll = async (req, res) => {
  try {
    const tags = await Tag.getAllTags();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.feed = async (req, res) => {
  try {
    const feed = await Tag.getUserFeed(req.user.id);
    res.json(feed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
