let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_posts = conn.define('vt_posts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  title: DataTypes.STRING,
  content: DataTypes.STRING,
  categories: DataTypes.STRING,
  tags: DataTypes.STRING,
  brands: DataTypes.STRING,
  featured_img: DataTypes.STRING,
  created_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
});

module.exports = vt_posts;