const User = require('../models/user'),
    Address = require('../models/Address'),
    ForgotPassword = require('../models/forgotPasswordToken'),
    emailHandeler = require('../services/emailHandle'),
    jwt = require('jsonwebtoken'),
    jwtkey = process.env.jwtkey





exports.registerController = (req, res) => {
    const {
        username,
        password,
        name,
        confirm_pass,
        email
    } = req.body
    User.addUser(name, username, password, confirm_pass, email, (user, err) => {

        if (err) {
            return res.status(500).json({
                "error": err
            })
        }

        emailHandeler.sendMail(user.email, "user registration", "<b>User registered successfully.<b>", (status, err) => {
            if (err) {
                console.log(err)
            }
            return res.sendStatus(200)
        })

    })
}
exports.loginController = (req, res) => {
    const {
        username,
        password
    } = req.body
    User.login(username, password, (user, err) => {

        if (err) {
            return res.status(500).json({
                "error": err
            })
        }
        const userData = {
            "username": user.username,
            "id": user._id
        }
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: userData
        }, jwtkey);
        return res.json({
            "accessToken": token
        })

    })
}
exports.addressController = (req, res) => {
    const {
        address,
        city,
        state,
        pincode,
        phoneno
    } = req.body

    Address.addAddress(req.user, address, city, state, pincode, phoneno, (address, err) => {
        if (err || !address) {
            return res.status(500).json({
                "error": err
            })
        }
        return res.sendStatus(200)
    })
}
exports.listController = (req, res) => {

    const pageNo = Number(req.params.page)
    Address.getAddresses(req.user.uid, pageNo, (addresses, err) => {
        if (err) {
            return res.status(500).json({
                "error": err
            })
        }

        return res.json(addresses)

    })
}
exports.deleteAddressController = (req, res) => {
    const aids = req.body.addressIds
    Address.deleteByIds(req.user.uid, aids, (result, err) => {
        if (err || !result) {
            return res.status(500).json({
                "error": err
            })
        }
        return res.sendStatus(200)
    })
}
exports.forgotPasswordController = (req, res) => {
    const username = req.body.username
    ForgotPassword.getToken(username, (token, user, err) => {
        if (err) {
            return res.status(500).json({
                "error": err
            })
        }

        let msg = "your password reset token is " + token
        emailHandeler.sendMail(user.email, "password reset", msg, (status, err) => {
            if (err) {
                return res.status(500).json({
                    "error": "internal error"
                })
            }

            return res.status(200).json({
                "info": "password reset token sent on your email"
            })
        })
    })
}
exports.verifyResetPasswordController = (req, res) => {
    const {
        newPassword,
        confirmPassword
    } = req.body
    ForgotPassword.veriyToken(req.params.resetToken, (user, err) => {
        if (err) {
            return res.status(500).json({
                "error": err
            })
        }
        User.resetPassword(user, true, 'none', newPassword, confirmPassword, (status, err) => {
            if (err) {
                return res.status(500).json({
                    "error": err
                })
            }
            emailHandeler.sendMail(user.email, "Password reset", "<b>Your password reset successfully</b>", (status, err) => {
                if (err) {
                    return res.status(500).json({
                        "error": "internal error"
                    })
                }
                return res.status(200).json({
                    "info": "password reset successfully"
                })
            })
        })
    })
}
exports.uploadProfileImage = (req, res) => {

    const {
        path
    } = req.file
    User.updateProfileImage(req.user, path, (result, err) => {
        if (err) {
            return res.status(500).json({
                "error": "internal error"
            })
        }
        return res.sendStatus(200)

    })


}