let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_users = conn.define('vt_users', {
  fullname: DataTypes.STRING,
  citystate: DataTypes.STRING,
  mobile: DataTypes.INTEGER,
  email: DataTypes.STRING,
  otp: DataTypes.INTEGER,
  pass: DataTypes.INTEGER,
  is_verified: DataTypes.BOOLEAN,
  token: DataTypes.STRING,
  onesignal_id: DataTypes.STRING
});

module.exports = vt_users;