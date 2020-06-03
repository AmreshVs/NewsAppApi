// let mysql = require('mysql');
let Sequelize = require('sequelize');

let mysqlConnection = new Sequelize('valartamilapi', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  define:{
    timestamps: false,
    freezeTableName: true,
  }
});

// let mysqlConnection = new Sequelize('amconsul_valartamilapi', 'amconsul_amresh', 'Amresh007!', {
//   host: '162.241.87.182',
//   port: 3306,
//   dialect: 'mysql',
//   define:{
//     timestamps: false,
//     freezeTableName: true,
//   }
// });

mysqlConnection.authenticate()
  .then(() => {
    console.log('Connection Established Successfully');
  })
  .catch((err) => {
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
  })

module.exports = mysqlConnection;