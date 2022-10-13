const jwt = require('jsonwebtoken');
const { logger } = require('../../utils/logger');
const log = logger({ name: 'Auth', filename: 'auth.log' })

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        log.info(token);
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch (error) {
        log.error(error);
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};