const userAddress = require('./userAddress')
    bcrypt = require('bcryptjs'),
    Address=require('./userAddress')

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
    address:{
        type:Schema.Types.ObjectId,
        ref:"userAddress",
        required:true
    },
    
});

userSchema.statics.addUser=function(name,username,password,confirm_pass,cb){
      
    if(!username || !password || !confirm_pass ||!name || password!=confirm_pass ){
        return cb(null,"Fields required")
    }

this.findOne({"username":username}).then(user=>{
        if(user){return cb(null,"Username already exist")}
        bcrypt.hash(password,12).then(hash=>{
            password=hash
            const newAddress=new Address({"address":[],"city":"","state":"","pincode":"","phoneno":""})
            newAddress.save().then(address=>{
                const newUser= new this({
                    "name":name,
                    "username":username,
                    "password":password,
                    "address":address
                })
                newUser.save().then(user=>{
                    if(!user){return cb(null,"DB error")}
                    return cb(user)
                }).catch(err=>console.log(err))
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

module.exports = mongoose.model('user', userSchema);


