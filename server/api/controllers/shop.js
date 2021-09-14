const mongoose = require("mongoose");
const User = require('../models/user');
const Product = require('../models/product');

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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

