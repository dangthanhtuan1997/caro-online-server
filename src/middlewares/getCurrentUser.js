const User = require('../user/user.model');

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.token._id);
        if (user) {
            const currentUser = user.toObject();
            Reflect.deleteProperty(currentUser, 'password');
            Reflect.deleteProperty(currentUser, 'salt');
            req.currentUser = currentUser;
            return next();
        }
        return res.sendStatus(401);
    } catch (error) {
        console.log(err);
        return next(err);
    }
};

export default getCurrentUser;