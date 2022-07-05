const {
    response
} = require('express')
const {
    db
} = require('./index')
const userAddress = {}

userAddress.sync = async function () {
    let result = await db.query('show tables')

    result = result.map(ele => ele.Tables_in_work2)
    if (!result.includes('userAddresses')) {
        newquery = `CREATE TABLE userAddresses(
            aid int NOT NULL AUTO_INCREMENT,
            UserUid int NOT NULL,
            address VARCHAR(255) NOT NULL,
            city VARCHAR(30) NOT NULL,
            state VARCHAR(30) NOT NULL,
            pincode VARCHAR(50) NOT NULL,
            phoneno VARCHAR(255),
            PRIMARY KEY (aid),
            FOREIGN KEY (UserUid) REFERENCES users(uid)

        )`
        return await db.query(newquery)

    }
}
userAddress.sync()

userAddress.create = async (uid, address, city, state, pincode, phoneno) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!phoneno) {
                phoneno = ""
            }
            newquery = "INSERT INTO userAddresses(UserUid,address,city,state,pincode,phoneno) VALUES('" + uid + "','" + address + "','" + city + "','" + state + "','" + pincode + "','" + phoneno + "')"
            resolve(await db.query(newquery))
        } catch (err) {
            reject(err)
        }
    })
}

userAddress.update = async (aid, address, city, state, pincode, phoneno) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (address) {
                await db.query("UPDATE userAddresses SET address='" + address + "' WHERE aid=" + aid)
            }
            if (city) {
                await db.query("UPDATE userAddresses SET city='" + city + "' WHERE aid=" + aid)
            }
            if (address) {
                await db.query("UPDATE userAddresses SET state='" + state + "' WHERE aid=" + aid)
            }
            if (address) {
                await db.query("UPDATE userAddresses SET pincode='" + pincode + "' WHERE aid=" + aid)
            }
            if (address) {
                await db.query("UPDATE userAddresses SET phoneno='" + phoneno + "' WHERE aid=" + aid)
            }
            resolve(true)
        } catch (err) {
            reject(err)
        }
    })

}

userAddress.addAddress = async function (user, address, city, state, pincode, phoneno) {
    return new Promise(async (resolve, reject) => {
        try {
            const newAddress = await userAddress.create(user.uid, address, city, state, pincode, phoneno)
            if (!newAddress) {
                const err = new Error("DB error")
                err.status = 500
                return reject(err)

            }
            return resolve(newAddress)

        } catch (err) {
            reject(err)
        }
    })

}
userAddress.updateAddress = async function (id, newAddress, city, state, pincode, phoneno) {
    return new Promise(async (resolve, reject) => {
        try {
            await this.update(id, newAddress, city, state, pincode, phoneno)

            return resolve(true)

        } catch (err) {
            reject(err)
        }
    })


}


userAddress.getAddresses = async function (uid, pageNo) {
    return new Promise(async (resolve, reject) => {
        try {
            const offset = (pageNo * 10) - 10
            newquery = "SELECT * FROM userAddresses order by aid limit 10 OFFSET " + offset
            const addresses = await db.query(newquery)
            // const addresses = await userAddress.findAndCountAll({
            //     where: {
            //         UserUid: uid
            //     },
            //     limit: 10,
            //     offset: (pageNo * 10) - 10
            // })
            if (addresses.length == 0) {
                const err = new Error("No addresses found")
                err.status = 500
                return reject(err)
            }
            return resolve(addresses)

        } catch (err) {
            reject(err)
        }
    })


}
userAddress.deleteByIds = async function (userId, aids) {
    return new Promise(async (resolve, reject) => {
        try {
            for (let i = 0; i < aids.length; i++) {
                newquery = "DELETE FROM userAddresses WHERE aid='" + aids[i] + "' AND UserUid='" + userId + "'"
                await db.query(newquery)
            }

            return resolve(true)
        } catch (err) {
            reject(err)
        }

    })


}



module.exports = userAddress