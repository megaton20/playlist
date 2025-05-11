const User = require('../models/User');
const Tag = require('../models/Tag');

exports.register = async (req, res) => {
  try {
    const { email, username, password, tagIds } = req.body;
    const user = await User.createUser({ email, username, password, tagIds });
    // Add email verification logic here (token generation + send)
    res.status(201).json(user.toSafeProfile());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  res.status(200).json({ user: req.user.toSafeProfile() });
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.getById(req.user.id);
    res.json(user.toSafeProfile());
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await User.getPublicProfile(req.params.id, req.user?.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
