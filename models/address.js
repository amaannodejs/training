const {
    sequelize
} = require('../services/connection'),
    Sequelize = require('sequelize')

const userAddress = sequelize.define('UserAddress', {
    aid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserUid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pincode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneno: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'userAddresses'
})

userAddress.addAddress = function (user, address, city, state, pincode, phoneno, cb) {

    userAddress.create({
        UserUid: user.uid,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        phoneno: phoneno
    }).then(address => {
        if (!address) {
            return cb(null, new Error("DB error"))
        }

        return cb(address)
    }).catch(console.error)

}
userAddress.updateAddress = function (id, newAddress, city, state, pincode, phoneno, cb) {
    userAddress.findOne({
        where: {
            aid: id
        }
    }).then(address => {

        address.address = newAddress,
            address.city = city,
            address.state = state,
            address.pincode = pincode,
            address.phoneno = phoneno
        address.save().then(address => {

            if (!address) {
                return cb(null, new Error("DB error"))
            }
            return cb(address)
        }).catch(console.error)
    }).catch(console.error)
}


userAddress.getAddresses = function (uid, pageNo, cb) {
    userAddress.findAndCountAll({
        where: {
            UserUid: uid
        },
        limit: 10,
        offset: (pageNo * 10) - 10
    }).then(addresses => {
        if (addresses.length == 0) {
            return cb(null, new Error("No addresses found"))
        }
        return cb(addresses)
    }).catch(console.error)
}
userAddress.deleteByIds = function (userId, aids, cb) {

    userAddress.destroy({
        where: {
            aid: aids,
            UserUid: userId
        }
    }).then(deleted => {

        return cb(true)
    }).catch(console.error)
}



module.exports = userAddress