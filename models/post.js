const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM,
        values: ['approved', 'rejected', 'in review'],
        default: 'in review'
    }
});

module.exports = Post;
