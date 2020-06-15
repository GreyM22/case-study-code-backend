const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EmployeePosition = sequelize.define('employeePosition', {
  current: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
},

})

module.exports = EmployeePosition;
