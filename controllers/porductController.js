const { set } = require("mongoose");
const productSchema = require("../models/productSchema");
const { UploadTcloudinery } = require("../services/cloudinerservice");
const sendResponse = require("../services/responsiveHandler");
const categorySchema = require("../models/categorySchema");
const SIZE_ENUM = require("../services/utils");
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
    const isSlugExist = await productSchema.findOne({
      slug: slug.toLowerCase(),
    });
    if (isSlugExist)
      return sendResponse(res, 400, "this slug is already exist");
    if (!category) return sendResponse(res, 400, "category is required");
    const isCategoryExist = await categorySchema.findById(category);
    if (!isCategoryExist) return sendResponse(res, 400, "invalid category");
    if (!price) return sendResponse(res, 400, "price is required");
    if (!Array.isArray(varinatsData) || varinatsData.length == 0)
      return sendResponse(res, 400, "minimum 1 variansts is required");
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
    if (new Set(skus).size !== skus.length) {
      return sendResponse(res, 400, "sku must be unique");
    }
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
    return sendResponse(res, 201, "product created sucessfull", true);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};
// .... getproduct part ......//
const getproductLis = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;
    const totallproducts = await productSchema.countDocuments();
    const pipeline = [
      {
        $match: {
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project:{
          title,
          thumbnail,
          description,
          category,
          price,
          discountpercentage,
          slug,
          images,
          variants,
          tags,
        },
      },
    ];
    if (category) {
      pipeline.push({
        $match: {
          "category.slug": category,
        },
      });
    }
    const productList = await productSchema.aggregate(pipeline);

    console.log(productList);

    // console.log(totallproducts);
    // const productList = await productSchema
    //   .find()
    //   .populate("category","name")
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });
    // console.log(productList);

    const totllpages = Math.ceil(totallproducts / limit);

    sendResponse(res, 200, "", true, {
      prodcuts: productList,
      pagination: {
        totall: totallproducts,
        limit,
        page,
        totllpages,
        hasNexPage: page < totllpages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Interlnal server error");
  }
};
// ......get single products details......//
const singleproductsdeatils = async (req, res) => {
  try {
    const { slug } = req.params;
    const productdata = await productSchema.find({ slug,isActive:true }).populate("category","name").select("-isActive -updatedAt -_v");
    if (!productdata) return sendResponse(res, 404, "product not found");
    sendResponse(res, 200, "", true, productdata);
  } catch (error) {
    sendResponse(res, 500, "internal server error");
  }
};
const updateroduct= async(req,res)=>{
  try {
    const {title,
      description,
      category,
      price, 
      discountpercentage,
      tags,
      variants,
      isActive,} = req.body;
  const {slug}=req.params;
  const productdata = await productSchema.findOne({slug})
  } catch (error) {
    sendResponse(res,500,"Internal server error")
  }
}
module.exports = { createproduct, getproductLis, singleproductsdeatils,updateroduct };
