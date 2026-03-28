const { set } = require("mongoose");
const productSchema = require("../models/productSchema");
const { UploadTcloudinery } = require("../services/cloudinerservice");
const sendResponse = require("../services/responsiveHandler");
const categorySchema = require("../models/categorySchema");
const SIZE_ENUM = ["s", "m", "L", "xl", "2xl", "3xl"];
const createproduct = async (req, res) => {
  try {
    const {
      title,
      description,
      slug,
      category,
      price,
      discountpercentage,
      tags,
      variants,
      isActive,
    } = req.body;
    // .apadotor jonno //
    const varinatsData = JSON.parse(variants);
    const thumbnail = req.files?.thumbnail;
    const images = req.files?.images;
    if (!title) return sendResponse(res, 400, "title is required");
    if (!description) return sendResponse(res, 400, "description is required");
    if (!slug) return sendResponse(res, 400, "slug is required");
    const isSlugExist = await productSchema.findOne({slug:slug.toLowerCase()});
    if(isSlugExist) return sendResponse(res,400,"this slug is already exist");
    if (!category) return sendResponse(res, 400, "category is required");
    const isCategoryExist = await categorySchema.findById(category);
    if (!isCategoryExist) return sendResponse(res, 400, "invalid category");
    if (!price) return sendResponse(res, 400, "price is required"); 
    if (!Array.isArray(varinatsData) || varinatsData.length == 0)
      return sendResponse(res, 400, "minimum 1 variansts is required");
    console.log(Array.isArray(variants));
    for (const variant of varinatsData) {
      if (!variant.sku) return sendResponse(res, 400, "sku is required ");
      if (!variant.color) return sendResponse(res, 400, "color is required ");
      if (!variant.sizes) return sendResponse(res, 400, "sizes is required ");
      if (!SIZE_ENUM.includes(variant.sizes))
        return sendResponse(res, 400, "invalid size");
      if (!variant.stock || variant.stock < 1)
        return sendResponse(res, 400, "stock is required ");
    }
    const skus = varinatsData.map((v) => v.sku);
    console.log(skus);

    if (new Set(skus).size !== skus.length) {
      return sendResponse(res, 400, "sku must be unique");
    };
    
    
    if (!thumbnail || thumbnail?.length === 0)
      return sendResponse(res, 400, "thumbnail is required");
    if (images && images?.length > 4)
      return sendResponse(res, 400, "you cant't upload images max 4");
    const thumbnailimg = await UploadTcloudinery(thumbnail[0], "thumbnail");
    let imgurl = await Promise.all(
      images.map(async (image) => {
        const imagesUrl = await UploadTcloudinery(image, "product");
        return imagesUrl.secure_url;
      }),
    );
    
        // let imagesUrl = [];
        // if (images) {
        //   for (const img of images) {
        //     const imgurl = await UploadTcloudinery(img, "product");
        //     imagesUrl.push(imgurl.secure_url);
        //   }
        // }
        // console.log(imagesUrl);

    const createproduct = new productSchema({
      title,
      description,
      category,
      price,
      discountpercentage,
      thumbnail: thumbnailimg.secure_url,
      images: imgurl,
      slug: slug.toLowerCase(),
      variants: varinatsData,
      isActive,
      tags,
    });
    createproduct.save();
    return sendResponse(res, 201, "product created sucessfull",true);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};

module.exports = { createproduct };
