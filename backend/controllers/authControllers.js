const userModel = require("../models/userModel")
const bcrypt = require('bcrypt') //securing the password by hashing
const JWT = require('jsonwebtoken');

//Register
const registerController = async (req,res) => { //req - from header(metadata - site url,token) and body(visible data)
    try {
        const {userName, email, password, phone, address,answer} = req.body
        //validation
        if(!userName || !email || !password || !address || !phone ||!answer){
            return res.status(500).send({
                success:false,
                message:'Please provide all the fields'
            });
        }

        //checking for existing user
        const existing = await userModel.findOne({email});
        if(existing){
            return res.status(500).send({
                success:false,
                message:'Email Already registered, Please login',
            });
        }

        //hashing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt) // we get the password from req body and sent to salt to hash it

        //new user registration
        const user = await userModel.create({userName, email, password:hashedPassword, address, phone,answer});
        res.status(201).send({
            success:true,
            message:'Successfully Registered!',
            user,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Register API',
            error
        });
    }
};

//Login
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide valid Email or Password",
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = JWT.sign(
  {
    id: user._id,
    usertype: user.usertype
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


        user.password = undefined;

        res.status(200).send({
            success: true,
            message: "Login Successful",
            token,
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login API",
            error,
        });
    }
};


module.exports = { registerController, loginController };