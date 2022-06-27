const user = require('../models/user')

const protectedRoute=require('../middleware/protectRoute'),
    User=require('../models/user'),
    Address=require('../models/userAddress'),
    ForgotPassword=require('../models/forgotPasswordToken'),
    jwt=require('jsonwebtoken'),
    jwtkey=process.env.jwtkey,
    emailHandeler=require('../services/emailHandle')
    
    

exports.registerController=(req,res)=>{
    if(!req.body.username||!req.body.password||!req.body.name||!req.body.confirmPassword||!req.body.email){}
    const {username,password,name,confirm_pass,email} =req.body
    User.addUser(name,username,password,confirm_pass,email,(user,err)=>{
        //console.log(err)
        if(err){return res.status(500).json({"error":err})}

        emailHandeler.sendMail(user.email,"user registration","<b>User registered successfully.<b>",(status,err)=>{
            if(err){console.log(err)}
            return res.sendStatus(200)
        })
        //return res.sendStatus(200)
    })

}
console.log(jwtkey)
exports.loginController=(req,res)=>{
    const {username,password}=req.body
    User.login(username,password,(user,err)=>{
        //console.log(err)
        if(err){return res.status(500).json({"error":err})}
        // AccessToken.getAccessToken(user,(token,err)=>{
        //     if(err){return res.status(500).json({"error":err})}
        //     return res.json({"accessToken":token})
        // })
        const userData={"username":user.username,"id":user._id}
        const token =jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: userData
          }, jwtkey);
          return res.json({"accessToken":token})
        
    })
}
exports.addressController=(req,res)=>{
    
    if(!req.body.address||!req.body.city||!req.body.state||!req.body.pincode||!req.body.phoneno){
        return res.status(500).json({"error":"field required"})
    }
    const {address,city,state,pincode,phoneno}=req.body,
    newAddress=new Address({
       "address":address,
       "city":city,
       "state":state,
       "pincode":pincode,
       "phonene":phoneno
    })
    newAddress.save().then(address=>{
        req.user.address.push(address._id)
        console.log(req.user)
        req.user.save().then(user=>{
            //console.log(user)
            return res.sendStatus(200)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log)
    

}
exports.listController=(req,res)=>{
    if(isNaN(req.params.page)){return res.status(500).json({"error":"field required"})}
    const perpage=10,
        pagenum=Number(req.params.page)
    User.find().limit(perpage ).skip(pagenum > 0 ? ( ( pagenum - 1 ) * perpage ) : 0).populate("address").exec().then(users=>{
        
        return res.json(users)
        
    }).catch(err=>console.log(err))
}

exports.deleteAddressController=(req,res)=>{
    if(req.body.addressIds.length==0){
        return res.status(500).json({"error":"field required"})
    }
    const {address,city,state,pincode,phonene,addressIds}=req.body,
    addressToDelete=req.user.address.filter(ele=>{return addressIds.includes(ele.toString())})
    console.log(addressToDelete)
    req.user.address=req.user.address.filter((ele)=>!addressToDelete.includes(ele))
    req.user.save().then(user=>{

        Address.deleteMany({"_id":{$in:addressToDelete}}).then(deletedAddress=>{
            return res.sendStatus(200)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
    Address.deleteMany({"_id":{$in:addressToDelete}}).then(deletedAddress=>{
        
    }).catch(err=>console.log(err))

    
}
exports.forgotPasswordController=(req,res)=>{
    
    if(!req.body.username){return res.status(500).json({"error":"username required"})}
    const {username}=req.body
   
    User.findOne({'username':username}).then(user=>{
        if(!user){return res.status(500).json({"error":"username invalid"})}
        ForgotPassword.getToken(user.username,user.name,(token,err)=>{
            if(err){return res.status(500).json({"error":err})}
            let msg="your password reset token is "+token
            return res.send(token)
            // emailHandeler.sendMail(user.email,"password reset",msg,(status,err)=>{
            //     if(err){return res.status(500).json({"error":"internal error"})}
                
            //     return res.status(200).json({"info":"password reset token sent on your email"})
            // })
        })
        
    }).catch(err=>console.log(err))
}

exports.verifyResetPasswordController=(req,res)=>{
    if(!req.body.newPassword||!req.body.confirmPassword||(req.body.newPassword!=req.body.confirmPassword)){
        return res.status(500).json({"error":"invaild information"})
    }
    const {newPassword,confirmPassword}=req.body
    console.log(req.params.resetToken)
    ForgotPassword.verifyToken(req.params.resetToken,(user,err)=>{
        if(err){return res.status(500).json({"error":err})}
        user.resetPassword(true,'none',newPassword,confirmPassword,(status,err)=>{
            if(err){return res.status(500).json({"error":err})}
            console.log('here')
            console.log(user)
            emailHandeler.sendMail(user.email,"Password reset","<b>Your password reset successfully</b>",(status,err)=>{
                if(err){return res.status(500).json({"error":"internal error"})}
                
                return res.status(200).json({"info":"password reset successfully"})

            })
        })
    })

}

exports.uploadProfileImage=(req,res)=>{
    
    if(!req.file){return res.status(500).json({"error":"no image found"})}
    const {path}=req.file
    req.user.updateProfileImage(path,(status,err)=>{
        if(err||!status){return res.status(500).json({"error":"internal server error"})}
        return res.sendStatus(200)
    })
    
}