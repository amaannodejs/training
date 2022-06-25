const mongoose = require('mongoose'),
    User=require("./user"),
    bcrypt = require('bcryptjs')
    Schema = mongoose.Schema;

const accessTokenSchema= new Schema({
    accessToken:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    expiry:{
        type:Date,
        requaired:true
    },
    
});

accessTokenSchema.statics.getAccessToken=function(user,cb){
    if(!user){return cb(null,"user is required")}
    bcrypt.hash(Date().toString(),12).then(hash=>{
        const accessToken=hash,
            expiry=new Date()
        expiry.setTime(expiry.getTime() + 1 * 60 * 60 * 1000)
        this.deleteMany({"userId":user._id}).then(removed=>{

            token=new this({
                "accessToken":accessToken,
                "userId":user._id,
                "expiry":expiry
            })
            
            token.save().then(token=>{
                
                if(!token){return cb(null,"DB error")}
                
                return cb(token.accessToken)
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))

    }).catch(err=>console.log(err))

}
accessTokenSchema.methods.getUser=function(cb){
    User.findOne().then(user=>{
        if(!user){return cb(null,"User not found")}
        return cb(user)
    }).catch(err=>console.log(err))
}

module.exports = mongoose.model('accessToken', accessTokenSchema);


