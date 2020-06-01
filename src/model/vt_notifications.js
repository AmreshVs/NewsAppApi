let conn = require('../db/connect');
let DataTypes = require('sequelize');

let vt_notifications = conn.define('vt_notifications', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  payload: DataTypes.STRING,
  user_id: DataTypes.STRING,
  notify_to: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
});

module.exports = vt_notifications;