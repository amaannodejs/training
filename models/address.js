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

userAddress.addAddress = async function (user, address, city, state, pincode, phoneno, cb) {

    try {
        const newAddress = await userAddress.create({
            UserUid: user.uid,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            phoneno: phoneno
        })
        if (!newAddress) {
            return cb(null, new Error("DB error"))
        }

        return cb(newAddress)
    } catch (err) {
        console.log(err)
    }


}
userAddress.updateAddress = async function (id, newAddress, city, state, pincode, phoneno, cb) {
    try {
        const address = await userAddress.findOne({
            where: {
                aid: id
            }
        })
        if (!address) {
            return cb(null, new Error("DB error"))
        }
        address.address = newAddress,
            address.city = city,
            address.state = state,
            address.pincode = pincode,
            address.phoneno = phoneno
        await address.save()

        return cb(address)
    } catch (err) {
        console.log(err)
    }

}


userAddress.getAddresses = async function (uid, pageNo, cb) {
    try {
        const addresses = await userAddress.findAndCountAll({
            where: {
                UserUid: uid
            },
            limit: 10,
            offset: (pageNo * 10) - 10
        })
        if (addresses.length == 0) {
            return cb(null, new Error("No addresses found"))
        }
        return cb(addresses)

    } catch (err) {
        console.log(err)
    }

}
userAddress.deleteByIds = async function (userId, aids, cb) {
    try {
        const delted = await userAddress.destroy({
            where: {
                aid: aids,
                UserUid: userId
            }
        })
        return cb(true)
    } catch (err) {
        console.log(err)
    }

}



module.exports = userAddress