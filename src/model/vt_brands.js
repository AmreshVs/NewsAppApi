let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_brands = conn.define('vt_brands', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING
});

module.exports = vt_brands;