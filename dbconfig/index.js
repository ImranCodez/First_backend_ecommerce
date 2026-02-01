const mongoose = require('mongoose');
const dbconfig = ()=>{
    return mongoose.connect(process.env.DB_URL)
             .then(() => console.log('DB_Connected####'));
}

module.exports=dbconfig


// j9LrS1Olc9F67WJV 