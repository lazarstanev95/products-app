const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Product = require("../models/product");
const { logger } = require("../../utils/logger");
const log = logger({ name: 'Users', filename: 'user.log' })

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.API_KEY
    }
}));

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exist'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            isAdmin: false
                        });
                        user.save()
                            .then(result => {
                                log.info(result);
                                res.status(201).json({
                                    result,
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                log.error(err);
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                })
            }
        })
};

exports.user_login = (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            isAdmin: user.isAdmin
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                                req.session.isLoggedIn = true;
                                req.session.user = user;
                                log.info('controller login req...', req);
                                return req.session.save(err => {
                                    log.error('err...', err);
                                });
                            }
                        });
                    }
                    else {
                        return res.status(400).json({
                            message: 'Incorrect Password'
                        });
                    }
                });
        });
};

exports.get_users = async (req, res, next) => {
    const totalCount = await User.countDocuments();
    let searchString = req.body.searchString;
    const page = req.body.page || 1;
    const docs = req.body.docs || 1000;
    let query = {};
    if (searchString) {
        query.$text = { $search: searchString };
    }
    User.find(query)
        .skip((page - 1) * docs)
        .limit(docs)
        .select('_id name lastName email isAdmin')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                totalCount: totalCount,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        lastName: doc.lastName,
                        email: doc.email,
                        isAdmin: doc.isAdmin,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/user/users'
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id name lastName email isAdmin')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/user/users/' + id
                    }
                })
            }
            else {
                res.status(404).json({ message: "Not valid entry found for provided ID" });
            }
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({ error: err });
        });
};

exports.update_user = (req, res, next) => {
    const id = req.params.userId
    const updatedName = req.body.name;
    const updatedLastName = req.body.lastName;
    const updatedEmail = req.body.email;
    const updatedIsAdmin = req.body.isAdmin;
    User.findById(id)
        .then(user => {
            user.name = updatedName;
            user.lastName = updatedLastName;
            user.email = updatedEmail;
            user.isAdmin = updatedIsAdmin;
            return user.save().then(result => {
                res.status(200).json({
                    message: 'User updated',
                    url: 'http://localhost:4000/user/users/' + id
                })
            })
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.post_user_reset_password = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            log.error(err);
            return;
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        message: 'User not found'
                    });
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save().then(result => {
                    res.status(200).json({
                        message: 'Reset password link is send to email!'
                    })
                });
            })
            .then(() => {
                transporter.sendMail({
                    to: req.body.email,
                    from: process.env.SEND_GRID_EMAIL,
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="${process.env.BASE_URL}new-password/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(err => {
                log.error(err)
            });
    })
};

exports.get_new_password = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then((user) => {
            res.status(200).json({
                userId: user._id/* .toString() */,
                passwordToken: token
            });
        })
        .catch(err => {
            log.error(err);
        });
};

exports.post_new_password = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Password is updated'
            })
        })
        .catch(err => {
            log.error(err);
        })
};

exports.get_liked_products = (req, res, next) => {
    //Product.find({ likes: req.user._id})
    Product.find({
        '_id': { $in: req.user.likedProducts }
    })
        .then(products => {
            const response = {
                products: products.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        description: doc.description,
                        productImage: doc.productImage,
                        likes: doc.likes,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/user/users/likedProducts'
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
};

/* exports.me = (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
}; */