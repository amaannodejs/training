const bodyParser = require('body-parser')

require('dotenv').config()
const uri= process.env.URI,
    express=require('express'),
    mongoose=require('mongoose'),
    userRoutes=require('../routes/users')
    app=express()








    app.use(bodyParser.json());
    app.use("/user",userRoutes)
    

exports.connect=async()=>{
    try{
        await mongoose.connect(uri);
        app.listen(process.env.PORT || 80, () => {
            console.log('80isUP!')
        });
    }catch(err){
        console.log(err)
    }
}
