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
            log.error(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.getImageFromStorage = (req, res, next) => {
    log.info(req.params);
    try {
        const key = req.params.key;
        const readStream = getFileStream(key);

        readStream.on('error', (err) => {
            log.error('error', err)
            res.status(500).json({
                error: err
            });
        }).pipe(res);
    } catch (error) {
        log.error(error);
    }
};

exports.uploadStorageImage = async (req, res, next) => {
    try {
        const files = req.files;
        const reqFiles = [];

        for (let i = 0; i < files.length; i++) {
            await uploadFile(files[i]);
            await unlinkFile(files[i].path);
            reqFiles.push({ imageName: files[i].filename, imageData: files[i].path.replace(/\\/g, "/") })
        }

        const newImage = new Image({ image: reqFiles });

        let result = await newImage.save();
        let images = result.image.map(item => item.imageName);
        res.status(200).json({
            success: true,
            document: {
                images: images
            }
        });
        log.info('Image uploaded successfuly');
    } catch (error) {
        log.error('error', error);
    }
};