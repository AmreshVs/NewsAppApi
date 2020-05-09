let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_categories = conn.define('vt_categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  created_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
});

module.exports = vt_categories;