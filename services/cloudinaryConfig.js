const cloudinary = require('cloudinary').v2;

const clodinaryConfig = ()=>{
    cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SEC, 
});
}
module.exports=clodinaryConfig