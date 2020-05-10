let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_brands = conn.define('vt_brands', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  created_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE
});

module.exports = vt_brands;