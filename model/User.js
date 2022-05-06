const mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
    
    companyName:{
        type:String
    }
    ,
    username: {
        type:String,
        required:[true,"Please Provide Username"]
    },
    email:{
        type:String,
        required:[true,"Please Provid Email Address"],
        unique:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
          ]
    },
    password:{
        type:String,
        required:[true,'Please add a User'],
        minlength:6
    }
});

const User = mongoose.model('User',UserSchema);
module.exports = User;