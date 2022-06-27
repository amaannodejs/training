const user = require('../models/user')

const express = require('express'),
    router = express.Router(),
    userController=require('../controllers/user'),
    protectedRoute=require('../middleware/protectRoute'),
    fileHandle=require('../services/fileHandle')






//post
router.post('/register',userController.registerController)

router.post('/login',userController.loginController)


router.post('/address',protectedRoute,userController.addressController) //protected

router.post('/forgot-password',userController.forgotPasswordController)
router.post('/verify-reset-password/:resetToken',userController.verifyResetPasswordController)
router.post('/profile-image',protectedRoute,fileHandle.single('images'),userController.uploadProfileImage)

//DELETE
router.delete('/address',protectedRoute,userController.deleteAddressController)

//get

router.get('/list/:page',protectedRoute,userController.listController) //protected












    module.exports= router;