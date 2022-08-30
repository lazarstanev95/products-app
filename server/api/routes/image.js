var express = require('express');
var Image = require('../models/image');
var router = express.Router();
const upload = require('../../utils/multer');
const imageController = require('../controllers/image');
const checkAuth = require('../middleware/check-auth');

/* 
    stores image in uploads folder
    using multer and creates a reference to the 
    file
*/

router.post("/uploadmulter", checkAuth, upload.single('imageData'), imageController.uploadImage);

/*
    upload image in base64 format, thereby,
    directly storing it in mongodb datanase
    along with images uploaded using firebase
    storage
*/    
router.route("/uploadbase")
    .post((req, res, next) => {
        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: req.body.imageData
        });

        newImage.save()
            .then((result) => {
                res.status(200).json({
                    success: true,
                    document: result
                });
            })
            .catch((err) => next(err));
    });


router.post('/uploadImage', checkAuth, upload.single('imageData'), imageController.uploadStorageImage)

module.exports = router;