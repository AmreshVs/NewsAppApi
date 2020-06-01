let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_users = conn.define('vt_users', {
  fullname: DataTypes.STRING,
  citystate: DataTypes.STRING,
  mobile: DataTypes.INTEGER,
  otp: DataTypes.INTEGER,
  is_verified: DataTypes.BOOLEAN,
  token: DataTypes.STRING,
  notification_token: DataTypes.STRING,
  notifications_viewed: DataTypes.STRING
});

module.exports = vt_users;