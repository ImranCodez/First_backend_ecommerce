const categorySchema = require("../models/categorySchema");
const { UploadTcloudinery } = require("../services/cloudinerservice");
const sendResponse = require("../services/responsiveHandler");

const CreateNewcategory = async (req, res) => {
  try {
    const { name, description,slug } = req.body;
    console.log(name, description,slug)
    const thumbnail = req.file;
    if (!name)  return sendResponse(res, 400, "name is required");
    if (!slug) return sendResponse(res, 400, "slug is required");
    if (!thumbnail) return sendResponse(res, 400, " thumnail is required");
    const Eixistingslug = await categorySchema.findOne({ slug });
    if (Eixistingslug)
      return sendResponse(res, 400, "this slug is already exist");
    const thumimg = await UploadTcloudinery(thumbnail, "categories");
    const category = new categorySchema({
      name,
      slug,
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
// .......get all category ....//
const getallcategories = async (req, res) => {
  try {
    const categories = await categorySchema.find({});
    
    
    sendResponse(res,200,"",true,categories)
  } catch (error) {
    sendResponse(res, 500, "internal server error");
  }
};
module.exports = { CreateNewcategory,getallcategories  };
