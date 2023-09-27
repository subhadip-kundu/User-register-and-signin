const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI


const databaseConnect = async () =>{
    mongoose.connect(MONGODB_URI)
    .then((conn)=>{
        console.log(`Connected to DB: ${conn.connection.host}`);
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports = databaseConnect;

