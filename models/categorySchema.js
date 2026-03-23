const mongoose= require("mongoose")
const categorySchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    thumbnail:{
        type:String,
        required:false,
    },
    description:{
        type:String
    }
})



module.exports= mongoose.model("category",categorySchema)