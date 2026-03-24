const mongoose= require("mongoose")
const categorySchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    thumbnail:{
        type:String,
        required:false,
    },
    description:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
})



module.exports= mongoose.model("category",categorySchema)