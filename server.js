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
app.use(route)



app.listen(8000, () => {
  console.log("server is runing");
  
});
