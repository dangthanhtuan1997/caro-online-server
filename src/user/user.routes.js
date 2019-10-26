const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport.config');
const User = require('../user/user.model');

const saltRounds = 10;

module.exports = (app) => {
    app.use('/users', router);

    router.post('/register', function (req, res) {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            if (err) { return res.status(500).json(err); }
            const user = new User({ ...req.body, password: hash });
            await user.save().catch(err => {
                return res.status(500).json(err);
            });
            const userModified = user.toObject();
            delete userModified._id;
            delete userModified.password;
            return res.status(201).json(userModified);
        });
    });
};



// router.post('/login', function (req, res, next) {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         if (err || !user) {
//             return res.status(403).json({
//                 message: info ? info.message : 'Login failed'
//             });
//         }

//         req.login(user, { session: false }, err => {
//             if (err) {
//                 console.log(err);
//                 return res.send(err);
//             }

//             console.log('login successfull!!!');
//             const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
//             return res.json({ user, token });
//         });
//     })(req, res);
// });

// router.post('/updateUser', async function (req, res, next) {
//     var name = req.body.name;
//     var email = req.body.email;
//     var dateOfBirth = req.body.dateOfBirth;
//     var sex = req.body.sex;
//     const hash = await bcrypt.hash(req.body.password, 10).catch(reason => {
//         return res.status(500).json(reason);
//     });
//     var UpdateUser = {
//         $set: {
//             name: name,
//             email: email,
//             dateOfBirth: dateOfBirth,
//             sex: sex,
//             password: hash
//         }
//     };
//     var id = { _id: req.body.id };
//     await UserModel.updateOne(id, UpdateUser, function (err, res) {
//         if (err) {
//             console.log(err);
//             return res.send(err);
//         }
//         console.log('1 document updated');
//     });
//     const success = 'success';
//     return res.json({ success });
// });