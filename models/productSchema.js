const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountpercentage: {
    type: Number,
    default: 0,
  },
  slug:{
    type:String,
    required:true,
    unique:true
  },

  thumbnail: {
    type: String,
    required: true,
  },
  images:[
    {
      type:String
    }
  ],
  variants: [
    {
      sku: {
        type: String,
        required: true,
        inique: true,
      },
     color: {
          type: String,
          required: true,
        },
        sizes: {
          type: String,
          required: true,
          enum: ["s", "m", "L", "xl", "2xl", "3xl"],
        },
        stock: {
          type: Number,
          required: true,
        },
    },
  ],
  tags:[
    {
      type:String
    }
  ],
  isActive:{
     type:Boolean,
     default:false
  }
},{Timestamp:true});


module.exports=mongoose.model("produt",productSchema)