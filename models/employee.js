const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Employee = sequelize.define('employee', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    birthday: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    jobExperience: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cv: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fired: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    personalID: {
      type: Sequelize.STRING,
      allowNull: false
  }
});

module.exports = Employee;
