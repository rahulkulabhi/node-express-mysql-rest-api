const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.getPosts = (request, response, next) => {
    Post.findAll({
        order: [ ['updatedAt',  'DESC'] ],
        include: [
            {
                model: User,
                attributes: ['name']
            },
            {
                model: Comment,
                attributes: ['content', 'status']
            }
        ]
    })
    .then(result => {
        // console.log(result);
        response.status(200).json({
            posts: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.getSelfPosts = (request, response, next) => {
    Post.findAll({
        where: {
            userId: {
                [Op.eq]: request.userId
            }
        },
        order: [ ['updatedAt',  'DESC'] ],
        include: [
            {
                model: User,
                attributes: ['name']
            },
            {
                model: Comment,
                attributes: ['content', 'status']
            }
        ]
    })
    .then(result => {
        // console.log(result);
        response.status(200).json({
            posts: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getPostDetails = (request, response, next) => {
    const postId = request.params.id;
    Post.findByPk(postId,
        {
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    attributes: ['content', 'status']
                }
            ]
        })
    .then(result => {
        // console.log(result);
        response.status(200).json({
            post: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (request, response, next) => {
    const errors = validationResult(request);
    const _title = request.body.title;
    const _content = request.body.content;
    let _imageUrl;

    if (!errors.isEmpty()) {
        return response.status(422).json({
            success: false,
            status: 422,
            message: 'Something went wrong!',
            errors: errors.array()
        });
    }

    if (!request.file) {
        // if image not found 
        _imageUrl = '';
    } else {
        // _imageUrl = request.file.path; // for MAC and linux
        _imageUrl = request.file.path.replace("\\" ,"/"); // for windows
        console.log('upload ', request.file.path);
    }

    Post.create({
        title: _title,
        content: _content,
        imageUrl: _imageUrl,
        status: 'approved',
        userId: request.userId
    })
    .then(result => {
        response.status(201).json({
            status: 201,
            success: true,
            message: "Post created successfully",
            response: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updatePost = (request, response, next) => {
    const postId = request.params.id;
    const errors = validationResult(request);
    const _title = request.body.title;
    const _content = request.body.content;
    const _userId = request.userId;
    let _imageUrl;

    if (!errors.isEmpty()) {
        return response.status(422).json({
            success: false,
            status: 422,
            message: 'Something went wrong!',
            errors: errors.array()
        });
    }
    
    if (request.file) {
        // _imageUrl = request.file.path; // for MAC and linux
        _imageUrl = request.file.path.replace("\\" ,"/"); // for windows
        console.log('upload ', request.file.path);
    }

    Post.findByPk(postId)
    .then(
        (post) => {
            if (post.dataValues.userId != _userId) {
                const error = new Error('Request user is not creator!');
                error.statusCode = 422;
                error.success = false;
                error.data = [];
                throw next(error);
            }
            post.title = _title;
            if (_imageUrl) {
                post.imageUrl = _imageUrl;
            }
            post.content = _content;
            return post.save();
        }
    )
    .then(
        data => {
            response.status(201).json({
                status: 201,
                success: true,
                message: "Post updated successfully",
                response: data
            });
        }
    )
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
