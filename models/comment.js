const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM,
        values: ['approved', 'rejected', 'in review'],
        default: 'in review'
    }
});

module.exports = Comment;