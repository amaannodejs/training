const User=require('../models/user'),
    jwt=require('jsonwebtoken'),
    jwtkey=process.env.jwtkey

const protectRoute =(req,res,next)=>{

    if(!req.headers.accesstoken){
        console.log('no acces token found in header')
        return res.status(500).json({"error":'auth fail'})
    }
    const token=req.headers.accesstoken
    jwt.verify(token, jwtkey,(err,decode)=>{
        if(err){return res.status(500).json({"error":'auth fail'})}
        User.findOne({"_id":decode.data.id}).then(user=>{
            if(!user){return res.status(500).json({"error":'DB error'})}
            req.user=user
           // console.log(user)
            return next()
        }).catch(err=>console.log(err))

    });
        
       

}
module.exports =  protectRoute