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

  thumbnail: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  variants: [
    {
      sku: {
        type: String,
        required: true,
        inique: true,
      },
      atributes: {
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
    },
  ],
  tags: {
    type: String,
    required: true,
  },
  isActive:{
     type:Boolean,
     default:false
  }
},{Timestamp:true});


module.exports=mongoose.model("produt",productSchema)