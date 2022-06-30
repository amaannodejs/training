const user = require('../models/user')

const express = require('express'),
    router = express.Router(),
    userController = require('../controllers/user'),
    protectedRoute = require('../middleware/protectRoute'),
    fileHandle = require('../services/fileHandle'),
    validator = require('../middleware/validation')






//post
router.post('/register', validator.register, userController.registerController)

router.post('/login', validator.login, userController.loginController)


router.post('/address', protectedRoute, validator.address, userController.addressController) //protected

router.post('/forgot-password', validator.forgotPassword, userController.forgotPasswordController)
router.post('/verify-reset-password/:resetToken', validator.verifyResetPassword, userController.verifyResetPasswordController)
router.post('/profile-image', protectedRoute, fileHandle.single('images'), validator.profileImage, userController.uploadProfileImage)

//DELETE
router.delete('/address', protectedRoute, validator.deleteAddress, userController.deleteAddressController)

//get

router.get('/list/:page', protectedRoute, validator.list, userController.listController) //protected




module.exports = router;