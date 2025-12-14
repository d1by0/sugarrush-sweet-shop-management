const express = require('express');
const cors = require('cors'); // cross server-client communication
const morgan = require('morgan'); //shows which API is getting hit 
const dotenv = require('dotenv'); //securing ports, secret API keys

const path = require('path');
const connectDb = require('./config/db');



//dot env configuration
dotenv.config({ path: path.join(__dirname, '.env') });

//db conncetion
connectDb();


//rest object - helps in using the features of express
const app = express()

//middleware
app.use(cors()); //cross communication
app.use(express.json()); //accessing the users information
app.use(morgan("dev")); //dev - whatever url is gettog hit, time it took, status code

//route - determination of the client's response
//URL => http://localhost:8080/test

app.use('/api/v1/test', require('./routes/testRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/user', require('./routes/userRoutes'));

app.use("/api/v1/sweets", require("./routes/sweetRoutes")); //sweets

app.use("/api/v1", require("./routes/checkoutRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes")); //for revenue



app.get('/', (req,res) =>{
    return res.status(200).send("<h1>Welcome to Sugar Rush</h1>");
});

//port
const PORT = process.env.PORT || 5000; //if .env file has some issues, we will have other port

//listen - helps in running the server
app.listen(PORT, () => {
    console.log(`Node Server is Running on ${PORT}`)
});
