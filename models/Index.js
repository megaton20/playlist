const sequelize = require('../config/database');
const User = require('./User');
const Playlist = require('./Playlist');
const Comment = require('./Comment');
const Tag = require('./Tag');


// Attach associations
User.associate({ Playlist, Tag });
Playlist.associate({ User, Comment, Tag });
Comment.associate({ User, Playlist, Comment });
Tag.associate({ User, Playlist });

// Export all
module.exports = {
  sequelize,
  User,
  Playlist,
  Comment,
  Tag,
};
