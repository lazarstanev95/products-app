const { uploadFile, getFileStream } = require('../middleware/s3');
const Image = require('../models/image');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const cloudinary = require('../../utils/cloudinary');
const { logger } = require('../../utils/logger');
const log = logger({ name: 'Image', filename: `image.log` });

exports.uploadImage = (req, res, next) => {
    log.info(req.body);
    const newImage = new Image({
        imageName: req.body.imageName,
        imageData: req.file.path.replace(/\\/g, "/")
    });
    newImage.save()
        .then((result) => {
            log.info(result);
            res.status(200).json({
                success: true,
                document: result
            });
        })
        .catch(err => {
            log.info(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.getImageFromStorage = (req, res, next) => {
    log.info(req.params);
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
};

exports.uploadStorageImage = async (req, res, next) => {
    try {
        const file = req.file;
        const result = await uploadFile(file);
        await unlinkFile(file.path);

        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: file.path.replace(/\\/g, "/")
        });

        await newImage.save();
        res.status(200).json({
            success: true,
            document: result
        });
        log.info('Image uploaded successfuly');
    } catch (error) {
        log.error('error', error);
    }
};