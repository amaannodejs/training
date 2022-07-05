const User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    jwtkey = process.env.jwtkey

const protectRoute = async (req, res, next) => {
    console.log('heresaddddasdasdas')
    if (!req.headers.accesstoken) {
        console.log('no acces token found in header')
        return res.status(500).json({
            "error": 'auth fail'
        })
    }
    const token = req.headers.accesstoken

    jwt.verify(token, jwtkey, async (err, decode) => {
        if (err) {
            return res.status(500).json({
                "error": 'auth fail'
            })
        }
        console.log(decode)
        try {
            const user = await User.findOne("username='"+decode.data.username+"'")
            if (!user) {
                return res.status(500).json({
                    "error": 'DB error'
                })
            }
            req.user = user
            return next()
        } catch (err) {
            console.log(err)
        }


    });



}
module.exports = protectRoute