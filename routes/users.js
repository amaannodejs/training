const express = require('express'),
    router = express.Router(),
    userController=require('../controllers/user'),
    protectedRoute=require('../middleware/protectRoute')






//post
router.post('/register',userController.registerController)

router.post('/login',userController.loginController)


router.post('/address',protectedRoute,userController.addressController) //protected


//get

router.get('/list/:page',protectedRoute,userController.listController) //protected










    module.exports= router;