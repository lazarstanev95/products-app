const Image = require('../models/image');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const cloudinary = require('../../utils/cloudinary');

exports.uploadImage = (req, res, next) => {
    console.log(req.body);
    const newImage = new Image({
        imageName: req.body.imageName,
        imageData: req.file.path.replace(/\\/g, "/")
    });
    newImage.save()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                success: true,
                document: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.uploadStorageImage = async (req, res, next) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path.replace(/\\/g, "/"));
        await unlinkFile(req.file.path);

        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: result.secure_url,
            cloudinaryId: result.public_id
        });

        await newImage.save();
        res.status(200).json({
            success: true,
            document: result
        });
    } catch (err) {
        res.status(400).json({
            error: err
        })
    }
};