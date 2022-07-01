const User = require('./user')

const {
    sequelize,
    Sequelize,
    jwt,
    jwtkey
} = require('./index')
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


Token.getToken = async function (username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                where: {
                    username: username
                }
            })
            if (!user) {
                const err = new Error('no user found with this username')
                err.status = 500
                return reject(err)
            }
            jwt.sign({
                "username": user.username,
                "name": user.name,
                "reason": "password-reset"
            }, jwtkey, {
                expiresIn: 600000
            }, async (err, token) => {
                if (err) {
                    const err = new Error("internal error")
                    err.status = 500
                    return reject(err)

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
                    const err = new Error("DB error")
                    err.status = 500
                    return reject(err)

                }
                return resolve({
                    token,
                    user
                })

            })
        } catch (err) {
            console.log(err)
        }
    })



}

Token.veriyToken = async function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            const deleted = await Token.destroy({
                where: {
                    token: token
                }
            })
            if (deleted == 0) {
                return reject(new Error('Token verification failed'))

            }
            jwt.verify(token, jwtkey, async (err, decode) => {
                if (err) {
                    return reject(new Error('Token verification failed'))

                }
                const user = await User.findOne({
                    where: {
                        username: decode.username
                    }
                })
                if (!user || decode.username != user.username) {
                    return reject(new Error('Token verification failed'))

                }
                return resolve(user)

            })

        } catch (err) {
            console.log(err)
        }
    })



}





User.hasOne(Token, {
    onDelete: "CASCADE"
})
module.exports = Token