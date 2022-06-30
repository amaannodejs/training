const {
    sequelize
} = require('../services/connection'),
    Sequelize = require('sequelize'),
    jwt = require('jsonwebtoken'),
    User = require('./user'),
    jwtkey = process.env.jwtkey

const Token = sequelize.define('fTokens', {
    tid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, {
    tableName: 'fTokens'
})


Token.getToken = async function (username, cb) {
    try {
        const user = await User.findOne({
            where: {
                username: username
            }
        })
        if (!user) {
            return cb(null, null, new Error('no user found with this username'))
        }
        jwt.sign({
            "username": user.username,
            "name": user.name,
            "reason": "password-reset"
        }, jwtkey, {
            expiresIn: 600000
        }, async (err, token) => {
            if (err) {
                return cb(null, null, new Error("internal error"))
            }
            const deleted = await Token.destroy({
                where: {
                    UserUid: user.uid
                }
            })
            const newToken = await Token.create({
                UserUid: user.uid,
                token: token
            })
            if (!newToken) {
                return cb(null, null, new Error("DB error"))
            }
            return cb(token, user)

        })
    } catch (err) {
        console.log(err)
    }


}

Token.veriyToken = async function (token, cb) {
    try {
        const deleted = await Token.destroy({
            where: {
                token: token
            }
        })
        if (deleted == 0) {
            return cb(null, new Error('Token verification failed'))
        }
        jwt.verify(token, jwtkey, async (err, decode) => {
            if (err) {
                return cb(null, 'Token verification failed')
            }
            const user = await User.findOne({
                where: {
                    username: decode.username
                }
            })
            if (!user || decode.username != user.username) {

                return cb(null, new Error('Token verification failed'))
            }

            return cb(user)
        })

    } catch (err) {
        console.log(err)
    }


}





User.hasOne(Token, {
    onDelete: "CASCADE"
})
module.exports = Token