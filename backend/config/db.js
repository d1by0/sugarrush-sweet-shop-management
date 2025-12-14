const e = require('express');
const mongoose = require('mongoose')
const colors = require('colors')

//function mongodb database connection
const connectDb = async () => { //exports directly
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to Database ${mongoose.connection.host}`.bgGreen);
    } catch (error) {
        console.log('DB error', error);  
    }
};

module.exports = connectDb;