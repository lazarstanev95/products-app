const express = require("express");
const router = express.Router();
const shopController = require('../controllers/shop');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, shopController.getCart);

router.post('/', checkAuth, shopController.postCart);

router.post('/removeProductQuantity', checkAuth, shopController.removeProductQuantity);

router.post('/cartDeleteItem', checkAuth, shopController.postCartDeleteProduct);

module.exports = router;