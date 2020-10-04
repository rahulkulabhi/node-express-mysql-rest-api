const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authentication');
const User = require('../models/user');

const router = express.Router();

router.put('/signup', [
    body('name').not().isEmpty().withMessage('Name is required.'),
    body('email')
    .isEmail()
    .withMessage('Enter a valid email.')
    .custom((value, {req}) => {
        return User.findOne({where: {email: value}})
        .then(user => {
            if (user) {
                return Promise.reject('User already exist with same email');
            }
        })
    }),
    body('password').isLength({min: 5}).withMessage('Password length should be min 5')
], authController.signup);

router.post('/signin', [
    body('email')
    .isEmail()
    .withMessage('Enter a valid email.')
    .custom((value, {req}) => {
        return User.findOne({where: {email: value}})
        .then(user => {
            if (!user) {
                return Promise.reject('User not exist with this email');
            }
        })
    }),
    body('password').isLength({min: 5}).withMessage('Password length should be min 5')
], authController.signin);

module.exports = router;


