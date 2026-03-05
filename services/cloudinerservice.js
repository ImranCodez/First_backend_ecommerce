const cloudinary = require("cloudinary").v2;

const UploadTcloudinery = async (file, folder) => {
  const base64ImageString = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64ImageString}`;
  // ..........for folder creation creation.......//
  return await cloudinary.uploader.upload(dataUri, { folder });
};
// ............for  delete img from cloudinery ............//
const DeletfromConfig = async (PublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(PublicId);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { UploadTcloudinery, DeletfromConfig };
