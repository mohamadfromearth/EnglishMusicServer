const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('Forbidden');

    try {
       const   user =jwt.verify(token, "jwtPrivateKey");
         req.body.id = user._id
        next();
    } catch (ex) {
        return res.status(401).send('Forbidden');
    }
};