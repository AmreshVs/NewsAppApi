let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_int_users = conn.define('vt_int_users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  pass: DataTypes.STRING,
  user_type: DataTypes.STRING,
  token: DataTypes.STRING,
});

module.exports = vt_int_users;