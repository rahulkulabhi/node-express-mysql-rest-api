const express = require('express');
const bodyparser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // for windows OS
const path = require('path');


const feedRoutes = require('./routes/feeds');
const authRoutes = require('./routes/authentication');
const sequelize = require('./utils/database');
const Post = require('./models/post');
const Comment = require('./models/comment');
const User = require('./models/user');

const app = express();

// multer checking
const fileStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (request, file, cb) => {
        //cb(null, new Date().toISOString() + '-' + file.originalname); // for linux and MAC OS
        cb(null, uuidv4() + '-' + file.originalname); // for windows OS
    }
});
const fileFilter = (request, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: Unsupported image file!');
    }
};
var upload = multer({ 
    storage: fileStorage, 
    fileFilter: fileFilter, 
    limits : {
        fileSize : 1000000 // max 1 MB size
    } 
});

// middlewares
app.use(bodyparser.json());
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(upload.single('image'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, request, response, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const success = error.success || false;
    const data = error.data;
    response.status(status).json({success: success, message: message, data: data});
});

Comment.belongsTo(Post, {onDelete: 'CASCADE'});
Post.hasMany(Comment);
Comment.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
Post.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Post);


sequelize
.sync()
// .sync({force: true})
.then(result => {
    // console.log(result);
    app.listen(1234);
})
.catch(err => {
    console.log(err);
});


