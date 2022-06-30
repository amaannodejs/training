const {
    sequelize
} = require('../services/connection')
Sequelize = require('sequelize'),
    Address = require('./address'),
    bcrypt = require('bcryptjs'),
    fs = require('fs')

const User = sequelize.define('User', {
    uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    profileImage: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'users'
})



User.addUser = async function (name, username, password, confirmPassword, email, cb) {
    try {
        const user = await User.findOne({
            where: {
                username: username
            }
        })
        if (user) {
            return cb(null, new Error("Username already exist"))
        }
        const hash = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            name: name,
            username: username,
            password: hash,
            email: email
        })
        if (!newUser) {
            return cb(null, new Error("DB error"))
        }
        return cb(newUser)

    } catch (err) {
        console.log(err)
    }

}

User.login = async function (username, password, cb) {
    try {
        const user = await User.findOne({
            where: {
                username: username
            }
        })
        if (!user) {
            return cb(null, new Error("Username not found!"))
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            return cb(null, new Error("Username & password combination is invaild!"))
        }
        return cb(user)
    } catch (err) {
        console.log(err)
    }

}

User.resetPassword = async function (user, isTokenVerified, oldPassword, newPassword, confirmPassword, cb) {

    try {
        const result = await bcrypt.compare(user.password, oldPassword)
        if ((!result && !isTokenVerified) || (newPassword != confirmPassword)) {

            return cb(null, new Error('user verification failed'))
        }
        const hash = await bcrypt.hash(newPassword, 12)
        if (!hash) {
            return cb(null, new Error('DB error'))
        }
        user.password = hash
        const savedUser = await user.save()
        if (!savedUser) {
            return cb(null, new Error("DB error"))
        }
        return cb(true)
    } catch (err) {
        console.log(err)
    }

}


User.updateProfileImage = async function (user, imagePath, cb) {
    try {
        if (user.profileImage) {

            fs.rm(user.profileImage, (err, status) => {
                if (err || !status) {
                    console.log(err)
                }
            })

        }
        user.profileImage = imagePath
        const savedUser = await user.save()
        if (!savedUser) {
            return cb(null, new Error('DB error'))
        }

        return cb(true)

    } catch (err) {
        console.log(err)
    }




}


User.hasMany(Address, {
    onDelete: "CASCADE"
})


module.exports = User