const express = require("express");
const cors = require("cors");
const dbconfig = require("./dbconfig");
const route = require("./router");
const cookieParser = require("cookie-parser");
const clodinaryConfig = require("./services/cloudinaryConfig");
const app = express();
app.use(cookieParser());
require("dotenv").config();
app.use(express.json());
app.use(cors());
dbconfig();
clodinaryConfig()
app.use(route);
const dns = require('node:dns/promises');
dns.setServers(["1.1.1.1", "8.8.8.8"]); 
app.listen(8000, () => {
  console.log("server is runing");
});
