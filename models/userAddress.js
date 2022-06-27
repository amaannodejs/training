const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userAddress= new Schema({
   
    address:{
        type:String,
        
    },
    city:{
        type:String,
        
    },
    state:{
        type:String,
        
    },
    pincode:{
        type:String,
        
    },
    phoneno:{
        type:String,
        
    }
});

userAddress.static.updateAddress=function(id,address,city,state,pincode,phoneno,cb){
    if(!address||!city||!state||!pincode){return cb(null,"fields are required")}
    this.findOneAndUpdate({"_id":id},{
        "address":address,
        "city":city,
        "state":state,
        "pincode":pincode,
        "phoneno":phoneno
    }).then(address=>{
        if(!address){return cb(null,"DB error")}
        return cb(address)
    }).catch(err=>console.log(err))
}

module.exports = mongoose.model('userAddress', userAddress);