const express = require("express");
const router = express.Router();
const shopController = require('../controllers/shop');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, shopController.postCart);

module.exports = router;