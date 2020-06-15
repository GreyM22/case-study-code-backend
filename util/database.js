const Sequelize = require('sequelize');

const sequelize = new Sequelize('case-study', 'root', 'caseStudy', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;
