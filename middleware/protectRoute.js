const User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    jwtkey = process.env.jwtkey

const protectRoute = (req, res, next) => {

    if (!req.headers.accesstoken) {
        console.log('no acces token found in header')
        return res.status(500).json({
            "error": 'auth fail'
        })
    }
    const token = req.headers.accesstoken

    jwt.verify(token, jwtkey, (err, decode) => {
        if (err) {
            return res.status(500).json({
                "error": 'auth fail'
            })
        }
        console.log(decode)
        User.findOne({
            where: {
                username: decode.data.username
            }
        }).then(user => {
            if (!user) {
                return res.status(500).json({
                    "error": 'DB error'
                })
            }
            req.user = user
            return next()
        }).catch(console.error)

    });



}
module.exports = protectRoute