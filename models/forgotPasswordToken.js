const user = require('./user');

const jwt=require('jsonwebtoken'),
    jwtkey=process.env.jwtkey

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const forgotTokenSchema= new Schema({
    username:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
});
forgotTokenSchema.statics.getToken=function(username,name,cb){
    if(!username){return cb(null,"fields required")}
    jwt.sign({"username":username,"name":name,"reason":"password-reset"},jwtkey,{expiresIn:600000},(err,token)=>{
        if(err){return cb(null,"internal error")}
        this.findOneAndDelete({'username':username}).then(deletedToken=>{
            const newToken=new this({
                'token':token,
                'username':username
            })
            newToken.save().then(savedToken=>{
                return cb(token)
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    })
    
}

forgotTokenSchema.statics.verifyToken=function(token,cb){
    if(!token){return cb(null,"token required")}

    this.findOneAndDelete({'token':token}).then(verifiedToken=>{
        if(!verifiedToken){return cb(null,'Token verification failed')}
        jwt.verify(verifiedToken.token,jwtkey,(err,decode)=>{
            
            
            if(err||decode.username!=verifiedToken.username){return cb(null,'Token verification failed')}
            user.findOne({'username':decode.username}).then(user=>{
                console.log(user)
                if(!user){return cb(null,'user verification failed')}
                return cb(user)
            }).catch(err=>console.log(err))
            
        })
    }).catch(err=>console.log(err))

}
module.exports = mongoose.model('forgotPasswordToken', forgotTokenSchema);