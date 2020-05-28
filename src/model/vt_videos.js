let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_videos = conn.define('vt_videos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  title: DataTypes.STRING,
  content: DataTypes.STRING,
  categories: DataTypes.STRING,
  brands: DataTypes.STRING,
  tags: DataTypes.STRING,
  featured_img: DataTypes.STRING,
  url: DataTypes.STRING,
  created_by: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
});

module.exports = vt_videos;