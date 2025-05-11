const { DataTypes, Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

class Comment extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Playlist, { foreignKey: 'playlistId' });
    this.hasMany(models.Comment, {
      foreignKey: 'parentId',
      as: 'replies'
    });
  }

  static async addComment({ userId, playlistId, content, parentId = null }) {
    const comment = await this.create({
      id: uuidv4(),
      userId,
      playlistId,
      content,
      parentId
    });
    await sequelize.models.Playlist.increment('commentsCount', {
      by: 1,
      where: { id: playlistId }
    });
    return comment;
  }

  static async getThread(playlistId) {
    return await this.findAll({
      where: { playlistId, parentId: null },
      include: [{ association: 'replies', include: ['User'] }, 'User']
    });
  }
}

Comment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  playlistId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Comment'
});

module.exports = Comment;
