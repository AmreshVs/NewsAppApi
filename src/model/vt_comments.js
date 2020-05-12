let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_comments = conn.define('vt_comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_id: DataTypes.INTEGER,
  comment: DataTypes.STRING,
  comment_type: DataTypes.STRING,
  reply_to: DataTypes.STRING,
  reply_id: DataTypes.INTEGER,
  is_verified: DataTypes.BOOLEAN,
  posted_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
});

module.exports = vt_comments;