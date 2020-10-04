const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const authHeader = request.get('Authorization');
    if (!authHeader) {
        const error = new Error('Authorization Failed!');
        error.statusCode = 401;
        error.success = false;
        error.data = [];
        throw error;
    }

    const _token = authHeader.split(' ')[1];
    let decoded;
    try {
        decoded = jwt.verify(_token, 'secret');
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decoded) {
        const error = new Error('Authorization Failed!');
        error.statusCode = 401;
        error.success = false;
        error.data = [];
        throw error;
    }

    request.userId = decoded.user.id;
    next();
};



