const AccessToken=require('../models/accesstoken')

const protectRoute =(req,res,next)=>{

    if(!req.headers.accesstoken){
        console.log('no acces token found in header')
        return res.status(500).json({"error":'auth fail'})
    }
    AccessToken.findOne({"accessToken":req.headers.accesstoken}).then(token=>{
        
        if(!token){
            console.log('access token invaild')
            return res.status(500).json({"error":'auth fail'})
        }
        const validTime=new Date()
        validTime.setTime(validTime.getTime() - (1 * 60 * 60 * 1000))
        if(token.expiry<validTime){
            console.log('access token expired')
            return res.status(500).json({"error":'auth fail'})
        }
        token.getUser((user,err)=>{
            
            if(err){return res.status(500).json({"error":'DB error'})}
            req.user=user
            next()
        })
    }).catch(err=>console.log(err))

}
module.exports =  protectRoute