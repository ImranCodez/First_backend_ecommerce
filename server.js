const express = require("express");
const port = 8000;
const cors = require("cors");
const dbconfig = require("./dbconfig");
const route = require("./router");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
dbconfig();
app.use(route)



app.listen(8000, () => {
  console.log("server is runing");
  
});
