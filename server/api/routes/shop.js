const express = require("express");
const router = express.Router();
const shopController = require('../controllers/shop');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, shopController.postCart);

router.get('/all', checkAuth, shopController.getCart);

router.post('/removeProductQuantity', checkAuth, shopController.removeProductQuantity);

router.post('/cartDeleteItem', checkAuth, shopController.postCartDeleteProduct);

module.exports = router;