const userAddress = require('./userAddress')
    bcrypt = require('bcryptjs'),
    Address=require('./userAddress'),
    fs=require('fs')

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:[{
        type:Schema.Types.ObjectId,
        ref:"userAddress"
    }],
    profileImage:{
        type:String
        
    }
    
});

userSchema.statics.addUser=function(name,username,password,confirm_pass,email,cb){
      
    if(!username || !password || !confirm_pass ||!name || password!=confirm_pass ||!email ){
        return cb(null,"Fields required")
    }

this.findOne({"username":username}).then(user=>{
        if(user){return cb(null,"Username already exist")}
        bcrypt.hash(password,12).then(hash=>{
            password=hash
            const newUser= new this({
                "name":name,
                "username":username,
                "password":password,
                "email":email,
                "address":[]
            })
            newUser.save().then(user=>{
                if(!user){return cb(null,"DB error")}
                return cb(user)
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
       
    }).catch(err=>console.log(err))
}

userSchema.statics.login= function(username,password,cb){
    if(!username || !password){return cb(null,"username and password are required!")}
    this.findOne({"username":username}).then(user=>{
        if(!user){return cb(null,"Username not found!")}
        console.log(user.password)
        bcrypt.compare(password,user.password).then(result=>{
            if(!result){return cb(null,"Username & password combination is invaild!")}
            return cb(user)
            
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))

}
userSchema.methods.resetPassword=function(isTokenVerified,oldPassword,newPassword,confirmPassword,cb){
    bcrypt.compare(this.password,oldPassword).then(result=>{

        if((!result&&!isTokenVerified)||(newPassword!=confirmPassword)){
            console.log('trigger')
            return cb(null,'user verification failed')
        }
        bcrypt.hash(newPassword,12).then(hash=>{
            if(!hash){return cb(null,'DB error')}
            this.password=hash
        this.save().then(savedUser=>{
            if(!savedUser){return cb(null,"DB error")}
            return cb(true)
        }).catch(err=>console.log(err))

        }).catch(err=>console.log(err))
        
        
    }).catch(err=>console.log(err))

}
userSchema.methods.updateProfileImage=function(imagePath,cb){

    if(this.profileImage){
        fs.rm(imagePath,(err,status)=>{
            if(err || !status){console.log(err)}

            this.profileImage=imagePath
            this.save().then(user=>{
                if(!user){return cb(null,'DB error')}
                return cb(true)
            }).catch(err=>console.log(err))

        })
    }

}

module.exports = mongoose.model('user', userSchema);


