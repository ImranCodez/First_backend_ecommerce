const cloudinary = require("cloudinary").v2;

const UploadTcloudinery = async (file, folder) => {
  const base64ImageString = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64ImageString}`;
  return await cloudinary.uploader.upload(dataUri, { folder });
};

const DeletfromConfig = async (PublicId) => {
  const result = await cloudinary.uploader.destroy(PublicId);
  console.log(result)
};

module.exports = {UploadTcloudinery,DeletfromConfig};
