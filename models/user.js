const {
    query
} = require('express')
const {
    profileImage
} = require('../middleware/validation')
const Address = require('./address')

const {
    db,
    bcrypt,
    fs
} = require('./index')


const User = {}



User.sync = async function () {
    let result = await db.query('show tables')

    result = result.map(ele => ele.Tables_in_work2)
    if (!result.includes('users')) {
        newquery = `CREATE TABLE users(
            uid int NOT NULL AUTO_INCREMENT,
            name VARCHAR(30) NOT NULL,
            username VARCHAR(30) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(50) NOT NULL,
            profileImage VARCHAR(255),
            PRIMARY KEY (uid)

        )`
        return await db.query(newquery)

    }
}
User.sync()
User.findOne = async (cond) => {
    return new Promise(async (resolve, reject) => {
        try {

            newquery = "SELECT * FROM users WHERE " + cond
            user = await db.query(newquery)
            resolve(user[0])
        } catch (err) {
            reject(err)
        }


    })

}
User.create = async (name, username, password, email, profileImage) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!profileImage) {
                profileImage = ""
            }
            newquery = "INSERT INTO users (name, username, password, email, profileImage) VALUES('" + name + "','" + username + "','" + password + "','" + email + "','" + profileImage + "')"
            resolve(await db.query(newquery))
        } catch (err) {
            reject(err)
        }
    })

}
User.update = async (oldUser, name, username, password, email, profileImage) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (name) {
                await db.query("UPDATE users SET name='" + name + "' WHERE uid=" + oldUser.uid)
            }
            if (username) {
                await db.query("UPDATE users SET username='" + username + "' WHERE uid=" + oldUser.uid)
            }
            if (password) {
                await db.query("UPDATE users SET password='" + password + "' WHERE uid=" + oldUser.uid)
            }
            if (email) {
                await db.query("UPDATE users SET email='" + email + "' WHERE uid=" + oldUser.uid)
            }
            if (profileImage) {
                await db.query("UPDATE users SET profileImage='" + profileImage + "' WHERE uid=" + oldUser.uid)
            }
            resolve(true)
        } catch (err) {
            reject(err)
        }


    })
}


User.addUser = async function (name, username, password, confirmPassword, email) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne("username='" + username + "'")
            if (user.length > 0) {
                const err = new Error("Username already exist")
                err.status = 500
                return reject(err)

            }
            const hash = await bcrypt.hash(password, 12)
            const newUser = await User.create(name, username, hash, email)
            if (!newUser) {
                const err = new Error("DB error")
                err.status = 500
                return reject(err)

            }
            return resolve(newUser)


        } catch (err) {
            reject(err)
        }
    })


}

User.login = async function (username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne("username='" + username + "'")
            if (!user) {
                const err = new Error("Username not found!")
                err.status = 500
                return rejects(err)
            }
            const result = await bcrypt.compare(password, user.password)
            if (!result) {
                const err = new Error("Username & password combination is invaild!")
                err.status = 500
                return rejects(err)
            }
            return resolve(user)
        } catch (err) {
            reject(err)
        }
    })


}

User.resetPassword = async function (user, isTokenVerified, oldPassword, newPassword, confirmPassword) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await bcrypt.compare(user.password, oldPassword)
            if ((!result && !isTokenVerified) || (newPassword != confirmPassword)) {
                const err = new Error('user verification failed')
                err.status = 500
                return reject(err)
            }
            const hash = await bcrypt.hash(newPassword, 12)
            if (!hash) {
                const err = new Error('DB error')
                err.status = 500
                return reject(err)
            }
            resultOp = User.update(user, null, null, hash, null, null)
            if (!resultOp) {
                const err = new Error('DB error')
                err.status = 500
                return reject(err)

            }
            return resolve(true)
        } catch (err) {
            reject(err)
        }
    })



}


User.updateProfileImage = async function (user, imagePath) {
    return new Promise(async (resolve, reject) => {
        try {
            if (user.profileImage) {

                await fs.rm(user.profileImage)

            }
            user.profileImage = imagePath
            result = await User.update(user, null, null, null, null, imagePath)
            if (!result) {
                const err = new Error('DB error')
                err.status = 500
                return reject(err)
            }

            return resolve(true)

        } catch (err) {
            reject(err)
        }
    })





}




module.exports = User