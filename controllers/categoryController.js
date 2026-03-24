const categorySchema = require("../models/categorySchema");
const { UploadTcloudinery } = require("../services/cloudinerservice");
const sendResponse = require("../services/responsiveHandler");
const CreateNewcategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const thumbnail = req.file;
    console.log(name);
    console.log(thumbnail);
    if (!name) sendResponse(res, 400, "name is required");
    if (!thumbnail) sendResponse(res, 400, " thumnail is required");
    const EixistingName = await categorySchema.findOne({ name });
    if (EixistingName)
      return sendResponse(res, 400, "this name is already exist");
    const thumimg = await UploadTcloudinery(thumbnail, "thumbnail");
    console.log("myimage", thumimg);
    const category = new categorySchema({
      name,
      description,
      thumbnail: thumimg.secure_url,
    });
    category.save();
    sendResponse(res, 201, "category created successfull", true, category);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};

module.exports = { CreateNewcategory };
