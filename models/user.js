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



User.addUser = function (name, username, password, confirmPassword, email, cb) {
    User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (user) {
            return cb(null, new Error("Username already exist"))
        }
        bcrypt.hash(password, 12).then(hash => {
            User.create({
                name: name,
                username: username,
                password: hash,
                email: email
            }).then(user => {
                if (!user) {
                    return cb(null, new Error("DB error"))
                }
                return cb(user)
            }).catch(console.error)
        }).catch(console.error)
    }).catch(console.error)
}

User.login = function (username, password, cb) {
    User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            return cb(null, new Error("Username not found!"))
        }
        bcrypt.compare(password, user.password).then(result => {
            if (!result) {
                return cb(null, new Error("Username & password combination is invaild!"))
            }
            return cb(user)

        }).catch(console.error)
    }).catch(console.error)
}

User.resetPassword = function (user, isTokenVerified, oldPassword, newPassword, confirmPassword, cb) {


    bcrypt.compare(user.password, oldPassword).then(result => {

        if ((!result && !isTokenVerified) || (newPassword != confirmPassword)) {

            return cb(null, new Error('user verification failed'))
        }
        bcrypt.hash(newPassword, 12).then(hash => {

            if (!hash) {
                return cb(null, new Error('DB error'))
            }
            user.password = hash
            user.save().then(savedUser => {
                if (!savedUser) {
                    return cb(null, new Error("DB error"))
                }
                return cb(true)
            }).catch(console.error)

        }).catch(console.error)
    }).catch(console.error)
}


User.updateProfileImage = function (user, imagePath, cb) {

    if (user.profileImage) {

        fs.rm(user.profileImage, (err, status) => {
            if (err || !status) {
                console.log(err)
            }
        })

    }

    user.profileImage = imagePath

    user.save().then(user => {
        if (!user) {
            return cb(null, new Error('DB error'))
        }

        return cb(true)
    }).catch(console.error)

}


User.hasMany(Address, {
    onDelete: "CASCADE"
})


module.exports = User