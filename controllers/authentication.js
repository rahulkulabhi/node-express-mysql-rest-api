const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const salt = bcrypt.genSaltSync(12);


exports.signup = (request, response, next) => {

    const _name = request.body.name;
    const _email = request.body.email;
    const _password = request.body.password;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.success = errors.isEmpty();
        error.data = errors.array();
        throw error;
    }

    console.log(_name, _email, _password);
    const hash = bcrypt.hashSync(_password, salt);
    const newUser = new User({
        name: _name,
        email: _email,
        password: hash,
        status: 'active'
    });
    newUser.save().then(result => {
        /*
        transport.sendMail({
            to: email,
            from: 'Admin <rahul.kulabhi@codeclouds.in>',
            subject: 'Signup Successfully!',
            html: `<h2>Welcome ${name}</h2>`
        });
        */
        response.status(201).json({
            success: true,
            message: 'User created!',
            user: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.signin = (request, response, next) => {
    const _email = request.body.email;
    const _password = request.body.password;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.success = errors.isEmpty();
        error.data = errors.array();
        throw error;
    }

    console.log(_email, _password);

    User.findOne({where: {email: _email}})
    .then(user => {
        if (!bcrypt.compareSync(_password, user.password)) {
            const error = new Error('Authentication failed!');
            error.statusCode = 422;
            error.success = false;
            error.data = [];
            throw next(error);
        }

        const _token = jwt.sign({user: user}, 'secret', { expiresIn: '1h' });
        response.status(200).json({
            success: true,
            message: 'User authenticated!',
            token: _token
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiUmFodWwga3VsYWJoaSIsImVtYWlsIjoicmFodWwua3VsYWJoaTY5QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEyJEpFUHU3eFhDNncxa08uTEtGeEpEZmVxOUpORnJHdklLaWJQL0JSUFRYWVBmaUFsMWxaT2RTIiwic3RhdHVzIjoiYWN0aXZlIiwidG9rZW4iOm51bGwsInRva2VuRXhwaXJlIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIwLTA5LTIwVDA2OjU4OjQzLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTA5LTIwVDA2OjU4OjQzLjAwMFoifSwiaWF0IjoxNjAwNTkzMjE1LCJleHAiOjE2MDA1OTY4MTV9.1YZNEIuQeyqj9qR0KrCr8ZfMsVnHDMUIB1xDuo5KGyY


