const { DataTypes, Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

class Playlist extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.hasMany(models.Comment, { foreignKey: 'playlistId' });
    this.belongsToMany(models.Tag, {
      through: models.PlaylistTag,
      foreignKey: 'playlistId',
      otherKey: 'tagId'
    });
  }

  static async createPlaylist({ userId, spotifyUrl, description, bannerUrl, tagIds = [] }) {
    const playlist = await this.create({
      id: uuidv4(),
      userId,
      spotifyUrl,
      description,
      bannerUrl
    });
    if (tagIds.length) await playlist.setTags(tagIds);
    return playlist;
  }

  async like(userId) {
    if (!this.likers.includes(userId)) {
      this.likers.push(userId);
      await this.save();
    }
  }

  async unlike(userId) {
    this.likers = this.likers.filter(id => id !== userId);
    await this.save();
  }

  getRankingScore() {
    return (this.likers?.length || 0) + this.commentsCount;
  }

  static async getById(id) {
    return await this.findByPk(id, {
      include: ['Tags', 'User', {
        association: 'Comments',
        include: ['User', { association: 'replies', include: ['User'] }]
      }]
    });
  }

  static async getByTags(tagIds) {
    return await this.findAll({
      include: [{
        association: 'Tags',
        where: { id: tagIds }
      }, 'User']
    });
  }

  static async getTrending(limit = 10) {
    return await this.findAll({
      order: [['commentsCount', 'DESC']],
      limit
    });
  }
}

Playlist.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  spotifyUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  bannerUrl: DataTypes.STRING,
  likers: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Playlist'
});

module.exports = Playlist;
