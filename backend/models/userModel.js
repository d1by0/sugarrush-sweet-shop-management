const mongoose = require('mongoose')

//schema
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true, 'User Name is required']
    },
    email:{
        type:String,
        required:[true, 'Email is reuired'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Password is required']
    },
    address:{
        type:Array,
        required:[true, 'Address is required']
    },
    phone:{
        type:String,
        required:[true, 'Phone number is required']
    },
    usertype:{
        type:String,
        required:[true, 'User Type is required'],
        default:'client',
        enum:['client','admin','vendor','driver']
    },
    profile:{
        type:String,
        default:'https://static.vecteezy.com/system/resources/previews/045/017/551/non_2x/default-businessman-avatar-profile-icon-social-media-business-vector.jpg'
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    },
},
{timestamps:true})

//export
module.exports = mongoose.model('User', userSchema)