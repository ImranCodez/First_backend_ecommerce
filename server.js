const express = require("express");
const cors = require("cors");
const dbconfig = require("./dbconfig");
const route = require("./router");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
require("dotenv").config();
app.use(express.json());
app.use(cors());
dbconfig();
app.use(route);

// Buffer concept

//  const tkn = Buffer.from(`jbkjfbkjbd:imranhosain@gamil.com`).toString("base64")
//  console.log("buffertoken=",tkn)
// convet the buffer to string
//  console.log("realbufffer=",Buffer.from(tkn,"base64"))
// convert the buffer string to real value whice are we had put into buffer 
//  console.log(Buffer.from(tkn,"base64").toString("utf-8").split(":"))

app.listen(8000, () => {
  console.log("server is runing");
});
