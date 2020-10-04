const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_api', 'root', 'Ghuntu@2014', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

