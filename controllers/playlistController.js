const Playlist = require('../models/Playlist');
const { getSpotifyTracks } = require('../services/spotifyService');

exports.create = async (req, res) => {
  try {
    const { spotifyUrl, description, bannerUrl, tagIds } = req.body;
    const playlist = await Playlist.createPlaylist({
      userId: req.user.id,
      spotifyUrl,
      description,
      bannerUrl,
      tagIds
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const playlist = await Playlist.getById(req.params.id);
    const tracks = await getSpotifyTracks(playlist.spotifyUrl);
    res.json({ playlist, tracks });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.like = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    await playlist.like(req.user.id);
    res.json({ message: 'Liked' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.unlike = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    await playlist.unlike(req.user.id);
    res.json({ message: 'Unliked' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.trending = async (req, res) => {
  try {
    const trending = await Playlist.getTrending();
    res.json(trending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
