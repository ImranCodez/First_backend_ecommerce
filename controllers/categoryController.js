const categorySchema = require("../models/categorySchema");
const sendResponse = require("../services/responsiveHandler");
const CreateNewcategory=(req,res)=>{
 try {
   const {name,description}= req.body;
   const thumbnail =req.file
  if(!name) sendResponse(res,400,"name is required");
  if(!thumbnail) sendResponse(res,400," thumnail is required");
     const category= new categorySchema({
      name,
      description,
      thumbnail:""
     })
     category.save()
    res.send(" hea category create hoise ");
 } catch (error) {
   sendResponse(res,500,"Internal server error")
    console.log(error);
   
 }
}





module.exports={CreateNewcategory}