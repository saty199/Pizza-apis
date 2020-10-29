const jwt = require('jsonwebtoken')
const config = require('./config');
const User = require('./Models/User');


module.exports = {
    verifyToken: async (req, res, next) => {
        var token = req.headers['authorization'] || req.cookies.auth;
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length).trimLeft();
            }
            jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    if (err.name == 'TokenExpiredError') {
                        return res.status(401).send({ success: false, message: 'JWT (token) expired ' });
                    }
                    else if (err.name == 'JsonWebTokenError') {
                        return res.status(401).send({ success: false, message: 'Invalid Signature Error' });
                    } else {
                        return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
                    }
                }
                else {
                    let user = await User.findOne({ _id: decoded.ID, token });
                    if (user) {
                        req.user = user;
                        req.token = token
                        next();
                    } else {
                        console.log({ user })
                        return res.status(401).send({ success: false, message: 'Failed to authenticate.' });
                    }
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    },

    assignToken: async (ID) => await jwt.sign({ ID }, config.JWT_SECRET),

}
