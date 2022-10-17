const mongoose = require('mongoose');
const { logger } = require('../../utils/logger');
const { count } = require('../models/product');
const log = logger({ name: 'Products', filename: 'products.log' });

const Product = require('../models/product');
const User = require('../models/user');

exports.product_create_product = (req, res, next) => {
    log.info('req file..', req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        productImages: req.body.productImages
    });
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    description: result.description,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.product_get_all = async (req, res, next) => {
    const totalCount = await Product.countDocuments();
    log.info('totalCount', totalCount);
    const page = req.body.page || 1;
    const docs = req.body.docs || 1000;
    let query = {};
    Product.find(query)
        .skip((page - 1) * docs)
        .limit(docs)
        .select('name price description _id productImages likes')
        .exec()
        .then(docs => {
            const response = {
                totalCount: totalCount,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        description: doc.description,
                        productImages: doc.productImages,
                        likes: doc.likes,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/products/' + doc._id
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

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                url: 'http://localhost:4000/products/'
            })
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name description price _id productImages')
        .exec()
        .then(doc => {
            log.info('From database', doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/'
                    }
                });
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

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updatedName = req.body.name;
    const updatedDescription = req.body.description;
    const udpatedPrice = req.body.price;
    const updatedProductImages = req.body.productImages;
    Product.findById(id)
        .then(product => {
            product.name = updatedName;
            product.description = updatedDescription;
            product.price = udpatedPrice;
            product.productImages = updatedProductImages;
            return product.save().then(result => {
                res.status(200).json({
                    message: "Product updated",
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + id
                    }
                });
            })
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.products_like_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .then(product => {
            const isLiked = product.likes.some((id) => id.toString() === req.user._id.toString());
            if (isLiked) {
                res.status(400).json({
                    message: 'This product is already liked!'
                });
            } else {
                User.findById(req.user._id)
                    .then(user => {
                        user.likedProducts.push(id);
                        return user.save();
                    });
                product.likes.push(req.user.id);
                return product.save().then(result => {
                    res.status(200).json({
                        message: 'Product is liked!'
                    });
                });
            }
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.products_unlike_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .then(product => {
            User.findById(req.user._id)
                .then(user => {
                    user.likedProducts = user.likedProducts.filter((productId) => productId.toString() !== id);
                    return user.save();
                });
            product.likes = product.likes.filter((id) => id.toString() !== req.user._id.toString());
            return product.save().then(result => {
                res.status(200).json({
                    message: 'Product is unliked!'
                });
            });
        })
        .catch(err => {
            log.error(err);
            res.status(500).json({
                error: err
            });
        });
}