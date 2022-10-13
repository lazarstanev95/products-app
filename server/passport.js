const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('./api/models/user');
const { logger } = require('./utils/logger');
const log = logger({ name: 'Passport', filename: 'passport.log' })
const opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = passport => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                log.info(user);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => log.error(err));
    }));
}