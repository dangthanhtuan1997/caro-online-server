const express = require('express');
const router = express.Router();
const User = require('../user/user.model');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar_' + req.body._id);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fieldSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

module.exports = (app) => {
    app.use('/uploads', router);

    router.post('/image', upload.single('userImage'), (req, res) => {
        var UpdateUser = {
            $set: {
                userImage: '/uploads/avatar_' + req.body._id
            }
        };
        User.findByIdAndUpdate({ _id: req.body._id }, UpdateUser, (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Upload failed, please try again' });
            }
            res.status(200).json({ message: 'Upload image success' });
        });
    });
};