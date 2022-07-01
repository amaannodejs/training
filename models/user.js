const Address = require('./address')

const {
    sequelize,
    Sequelize,
    bcrypt,
    fs
} = require('./index')

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



User.addUser = async function (name, username, password, confirmPassword, email) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                where: {
                    username: username
                }
            })
            if (user) {
                const err = new Error("Username already exist")
                err.status = 500
                return reject(err)

            }
            const hash = await bcrypt.hash(password, 12)
            const newUser = await User.create({
                name: name,
                username: username,
                password: hash,
                email: email
            })
            if (!newUser) {
                const err = new Error("DB error")
                err.status = 500
                return reject(err)

            }
            return resolve(newUser)


        } catch (err) {
            console.log(err)
        }
    })


}

User.login = async function (username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                where: {
                    username: username
                }
            })
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
            console.log(err)
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
            user.password = hash
            const savedUser = await user.save()
            if (!savedUser) {
                const err = new Error('DB error')
                err.status = 500
                return reject(err)

            }
            return resolve(true)
        } catch (err) {
            console.log(err)
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
            const savedUser = await user.save()
            if (!savedUser) {
                const err = new Error('DB error')
                err.status = 500
                return reject(err)
            }

            return resolve(true)

        } catch (err) {
            console.log(err)
        }
    })





}


User.hasMany(Address, {
    onDelete: "CASCADE"
})


module.exports = User