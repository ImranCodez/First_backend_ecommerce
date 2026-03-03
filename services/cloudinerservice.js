const cloudinary = require('cloudinary').v2;

const UploadTcloudinery=async(file)=>{
    const base64ImageString =file.buffer.toString('base64');
const dataUri = `data:${file.mimetype};base64,${base64ImageString}`;  
  return await cloudinary.uploader.upload(dataUri);
}



module.exports=UploadTcloudinery