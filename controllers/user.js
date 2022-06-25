const protectedRoute=require('../middleware/protectRoute'),
    User=require('../models/user'),
    Address=require('../models/userAddress'),
    AccessToken=require('../models/accesstoken'),
    jwt=require('jsonwebtoken'),
    jwtkey=process.env.jwtkey

exports.registerController=(req,res)=>{
    const {username,password,name,confirm_pass} =req.body
    User.addUser(name,username,password,confirm_pass,(user,err)=>{
        //console.log(err)
        if(err){return res.status(500).json({"error":err})}
        return res.sendStatus(200)
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
    
    if((req.body.address.length == 0)||!req.body.city||!req.body.state||!req.body.pincode||!req.body.phoneno){
        return res.status(500).json({"error":"field required"})
    }
    
    Address.findOne({"_id":req.user.address}).then(address=>{
        
        address.address=req.body.address
        address.city=req.body.city
        address.state=req.body.state
        address.pincode=req.body.pincode
        address.phoneno=req.body.phoneno
        address.save().then(address=>{
            return res.sendStatus(200)
        }).catch(err=>console.log(err))
        
    }).catch(err=>console.log(err))
    

}
exports.listController=(req,res)=>{
    if(isNaN(req.params.page)){return res.status(500).json({"error":"field required"})}
    const perpage=10,
        pagenum=Number(req.params.page)
    User.find().limit(perpage ).skip(pagenum > 0 ? ( ( pagenum - 1 ) * perpage ) : 0).populate("address").exec().then(users=>{
        console.log(req.headers["key"])
        return res.json(users)
        
    }).catch(err=>console.log(err))
}