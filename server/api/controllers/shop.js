const mongoose = require("mongoose");
const User = require('../models/user');
const Product = require('../models/product');
const { logger } = require("../../utils/logger");
const log = logger({ name: 'Shop', filename: 'shop.log' })

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            const totalCount = products.reduce((a, c) => a + c.quantity, 0);
            const totalPrice = products.reduce((a, c) => a + c.productId.price * c.quantity, 0);
            res.status(200).json({
                products,
                totalCount,
                totalPrice
            });
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    const user = new User({
        _id: '5d3c5dce869d3e300c2040a3',//new mongoose.Types.ObjectId(),
        name: 'djombi',
        email: 'djombi@test.com',
        password: 'test'
    });
    //user.emailUser(); */
    Product.findById(prodId)
        .then(product => {
            /* User.findById({_id: '5d3c5dce869d3e300c2040a3'})
            .then(user => {
                user.addToCart(product);
            }) */
            return req.user.addToCart(product);
        })
        .then(result => {
            res.status(200).json({
                message: "Cart updated",
            });
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.removeProductQuantity = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.removeProductQuantity(product);
        })
        .then(result => {
            res.status(200).json({
                message: "Cart updated",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.status(200).json({
                message: "Product is removed from cart",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

