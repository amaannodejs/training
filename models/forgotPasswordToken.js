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


Token.getToken = function (username, cb) {
    User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            return cb(null, null, new Error('no user found with this username'))
        }
        jwt.sign({
            "username": user.username,
            "name": user.name,
            "reason": "password-reset"
        }, jwtkey, {
            expiresIn: 600000
        }, (err, token) => {
            if (err) {
                return cb(null, null, new Error("internal error"))
            }

            Token.destroy({
                where: {
                    UserUid: user.uid
                }
            }).then(deleted => {
                Token.create({
                    UserUid: user.uid,
                    token: token
                }).then(newtoken => {
                    if (!newtoken) {
                        return cb(null, null, new Error("DB error"))
                    }
                    return cb(token, user)
                }).catch(console.error)
            }).catch(console.error)
        })
    }).catch(console.error)

}

Token.veriyToken = function (token, cb) {
    Token.destroy({
        where: {
            token: token
        }
    }).then(deleted => {
        if (deleted == 0) {
            return cb(null, new Error('Token verification failed'))
        }
        jwt.verify(token, jwtkey, (err, decode) => {
            if (err) {
                return cb(null, 'Token verification failed')
            }
            User.findOne({
                where: {
                    username: decode.username
                }
            }).then(user => {
                if (!user || decode.username != user.username) {

                    return cb(null, new Error('Token verification failed'))
                }

                return cb(user)
            }).catch(console.error)
        })
    }).catch(console.error)
}





User.hasOne(Token, {
    onDelete: "CASCADE"
})
module.exports = Token