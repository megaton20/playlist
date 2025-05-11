const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

class User extends Model {
  static associate(models) {
    this.hasMany(models.Playlist, { foreignKey: 'userId' });
    this.belongsToMany(models.Tag, {
      through: models.UserTag,
      foreignKey: 'userId',
      otherKey: 'tagId'
    });
  }

  async validPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static async createUser({ email, username, password, tagIds = [] }) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.create({ id: uuidv4(), email, username, password: hashed });
    if (tagIds.length) await user.setTags(tagIds);
    return user;
  }

  static async getById(id) {
    return await this.findByPk(id, {
      include: ['Tags', 'Playlists']
    });
  }

  static async getPublicProfile(userId, currentUserId) {
    const user = await this.findByPk(userId, {
      attributes: ['id', 'username', 'bio', 'avatarUrl'],
      include: [{
        association: 'Playlists',
        include: ['Tags']
      }, {
        association: 'Tags'
      }]
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  toSafeProfile() {
    const { id, username, avatarUrl, bio } = this;
    return { id, username, avatarUrl, bio };
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatarUrl: DataTypes.STRING,
  bio: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'User'
});

module.exports = User;
