const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userAddress= new Schema({
   
    address:[{
        type:String,
        
    }],
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

module.exports = mongoose.model('userAddress', userAddress);