let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_pdfs = conn.define('vt_pdfs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  categories: DataTypes.STRING,
  brands: DataTypes.STRING,
  tags: DataTypes.STRING,
  featured_img: DataTypes.STRING,
  url: DataTypes.STRING,
  created_by: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
});

module.exports = vt_pdfs;