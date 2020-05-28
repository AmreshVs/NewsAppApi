let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_favourites = conn.define('vt_favourites', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_id: DataTypes.INTEGER,
  news: DataTypes.STRING,
  videos: DataTypes.STRING,
  pdfs: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
});

module.exports = vt_favourites;