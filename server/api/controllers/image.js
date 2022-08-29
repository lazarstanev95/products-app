const { uploadFile, getFileStream } = require('../middleware/s3');
const Image = require('../models/image');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

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

exports.getImageFromStorage = (req, res, next) => {
    console.log(req.params)
    const key = req.params.key
    const readStream = getFileStream(key)

    readStream.pipe(res)
};

exports.uploadStorageImage = async (req, res, next) => {
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
};