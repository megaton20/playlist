const { DataTypes, Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

class Tag extends Model {
  static associate(models) {
    this.belongsToMany(models.User, {
      through: models.UserTag,
      foreignKey: 'tagId',
      otherKey: 'userId'
    });
    this.belongsToMany(models.Playlist, {
      through: models.PlaylistTag,
      foreignKey: 'tagId',
      otherKey: 'playlistId'
    });
  }

  static async createTag(name) {
    return await this.findOrCreate({ where: { name } });
  }

  static async getAllTags() {
    return await this.findAll();
  }

  static async getUserFeed(userId) {
    const user = await sequelize.models.User.findByPk(userId, {
      include: ['Tags']
    });

    const tagIds = user.Tags.map(tag => tag.id);
    return await sequelize.models.Playlist.getByTags(tagIds);
  }
}

Tag.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Tag'
});

module.exports = Tag;
