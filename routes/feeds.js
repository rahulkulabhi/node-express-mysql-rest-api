const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feeds');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', [isAuth], feedController.getPosts);
router.get('/posts/edit/:id', [isAuth], feedController.getPostDetails);
router.get('/posts/self', [isAuth], feedController.getSelfPosts);

router.post('/post', [
    isAuth,
    body('title').isLength({ min: 5 }),
    body('content').isLength({ min: 5 })
], feedController.createPost);

router.post('/post/edit/:id', [
    isAuth,
    body('title').isLength({ min: 5 }),
    body('content').isLength({ min: 5 })
], feedController.updatePost);

module.exports = router;

