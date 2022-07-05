exports.register = (req, res, next) => {

    if (!req.body.username || !req.body.password || !req.body.name || !req.body.confirmPassword || !req.body.email) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }

    return next()

}
exports.login = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }
    return next()
}
exports.address = (req, res, next) => {
    if (!req.body.address || !req.body.city || !req.body.state || !req.body.pincode || !req.body.phoneno) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }
    return next()
}
exports.forgotPassword = (req, res, next) => {
    if (!req.body.username) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }
    return next()
}
exports.verifyResetPassword = (req, res, next) => {
    if (!req.body.newPassword || !req.body.confirmPassword || (req.body.newPassword != req.body.confirmPassword)) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }
    return next()
}
exports.profileImage = (req, res, next) => {
    if (!req.file) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }
    return next()
}
exports.deleteAddress = (req, res, next) => {
    if (req.body.addressIds.length == 0) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }
    return next()
}
exports.list = (req, res, next) => {
    if (isNaN(req.params.page)) {
        return res.status(500).json({
            "error": "validation failed"
        })
    }
    return next()
}