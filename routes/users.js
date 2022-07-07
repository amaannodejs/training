const {
    express,
    userController,
    protectRoute,
    fileHandler,
    validator
} = require('./index')
const router = express.Router()






//post
router.post('/register', validator.register, userController.registerController)

router.post('/login', validator.login, userController.loginController)


router.post('/address', protectRoute, validator.address, userController.addressController) //protected

router.post('/forgot-password', validator.forgotPassword, userController.forgotPasswordController)
router.post('/verify-reset-password/:resetToken', validator.verifyResetPassword, userController.verifyResetPasswordController)
router.post('/profile-image', protectRoute, fileHandler.single('images'), validator.profileImage, userController.uploadProfileImage)

//DELETE
router.delete('/address', protectRoute, validator.deleteAddress, userController.deleteAddressController)

//get

router.get('/list/:page', protectRoute, validator.list, userController.listController) //protected




module.exports = router;