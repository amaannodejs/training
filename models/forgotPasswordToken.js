const User = require('./user')

const {
    db,
    jwt,
    jwtkey
} = require('./index')
const {
    response
} = require('express')
const Token = {}

Token.sync = async function () {
    let result = await db.query('show tables')
    result = result.map(ele => ele.Tables_in_work2)
    if (!result.includes('fTokens')) {
        newquery = `CREATE TABLE fTokens(
            tid int NOT NULL AUTO_INCREMENT,
            token VARCHAR(255) NOT NULL,
            uid int NOT NULL,
            PRIMARY KEY (tid),
            FOREIGN KEY (uid) REFERENCES users(uid)
        )`
        return await db.query(newquery)
    }

}
Token.sync()

Token.destroy = async (cond) => {
    return new Promise(async (resolve, reject) => {
        try {
            newquery = "DELETE FROM fTokens WHERE " + cond
            resolve(await db.query(newquery))
        } catch (err) {
            reject(err)
        }

    })
}
Token.create = async (uid, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            newquery = "INSERT INTO fTokens (uid,token) VALUES('" + uid + "','" + token + "')"
            resolve(await db.query(newquery))

        } catch (err) {
            reject(err)
        }
    })
}
Token.destroy = async (cond) => {
    return new Promise(async (resolve, reject) => {
        try {
            newquery = "DELETE FROM fTokens WHERE " + cond
            result = await db.query("DELETE FROM fTokens WHERE " + cond)
            resolve(result.affectedRows)

        } catch (err) {
            reject(err)
        }
    })

}


Token.getToken = async function (username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne("username='" + username + "'")
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
                await Token.destroy("uid=" + user.uid)
                result = await Token.create(user.uid, token)
                if (!result) {
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
            reject(err)
        }
    })



}

Token.veriyToken = async function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Token.destroy("token='" + token + "'")
            if (result == 0) {
                return reject(new Error('Token verification failed'))

            }
            jwt.verify(token, jwtkey, async (err, decode) => {
                if (err) {
                    return reject(new Error('Token verification failed'))

                }
                const user = await User.findOne("username='" + decode.username + "'")
                if (!user || decode.username != user.username) {
                    return reject(new Error('Token verification failed'))

                }
                return resolve(user)

            })

        } catch (err) {
            reject(err)
        }
    })



}





// User.hasOne(Token, {
//     onDelete: "CASCADE"
// })
module.exports = Token