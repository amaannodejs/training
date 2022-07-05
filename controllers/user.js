const {
    User,
    Address,
    ForgotPassword,
    fileHandler,
    emailHandler,
    jwt,
    jwtkey
} = require('./index')





exports.registerController = async (req, res) => {
    try {
        const {
            username,
            password,
            name,
            confirm_pass,
            email
        } = req.body
        const user = await User.addUser(name, username, password, confirm_pass, email)
        await emailHandler.sendMail(user.email, "user registration", "<b>User registered successfully.<b>")
        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }


}
exports.loginController = async (req, res) => {
    try {

        const {
            username,
            password
        } = req.body
        const user = await User.login(username, password)
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
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }

}
exports.addressController = async (req, res) => {
    try {
        const {
            address,
            city,
            state,
            pincode,
            phoneno
        } = req.body
        await Address.addAddress(req.user, address, city, state, pincode, phoneno)
        return res.sendStatus(200)


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }



}
exports.listController = async (req, res) => {
    try {
        const pageNo = Number(req.params.page)
        const addresses = await Address.getAddresses(req.user.uid, pageNo)
        return res.json(addresses)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }


}
exports.deleteAddressController = async (req, res) => {
    try {
        const aids = req.body.addressIds
        await Address.deleteByIds(req.user.uid, aids)
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }


}
exports.forgotPasswordController = async (req, res) => {
    try {
        const username = req.body.username
        const {
            token,
            user
        } = await ForgotPassword.getToken(username)
        let msg = "your password reset token is " + token
        await emailHandler.sendMail(user.email, "password reset", msg)
        return res.status(200).json({
            "info": "password reset token sent on your email"
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }


}
exports.verifyResetPasswordController = async (req, res) => {
    try {
        const {
            newPassword,
            confirmPassword
        } = req.body
        const user = await ForgotPassword.veriyToken(req.params.resetToken)
        await User.resetPassword(user, true, 'none', newPassword, confirmPassword)
        await emailHandler.sendMail(user.email, "Password reset", "<b>Your password reset successfully</b>")
        return res.status(200).json({
            "info": "password reset successfully"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }


}
exports.uploadProfileImage = async (req, res) => {
    try {
        const {
            path
        } = req.file
        await User.updateProfileImage(req.user, path)
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "err": String(err)
        })
    }





}