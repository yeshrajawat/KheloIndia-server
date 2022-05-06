const User = require("../model/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { head } = require("../routes");
const JWT_SECRET_KEY = "AGUERO";

module.exports.signup =  async (req,res) => {

    const {username,email,password} = req.body;

    let existingUser;

    try {
        existingUser =  User.findOne({email:email},(err,user)=>{
           
                if(err || user){
                        return res.status(400).
                        json( user ?{message:"User already Exists"} : {message:err});
                    
                }
           
           
            if(!user){
                
                const hashedPassword = bcrypt.hashSync(password);
                const user = new User({
                    username,
                    email,
                    password:hashedPassword
                });
            
                try {
                     user.save();
                } catch (error) {
                    console.log(error);
                }
            
                return res.status(201).json({message:user});

            }
        });

    } catch (error) {
        console.log(error);
    }

    


   
}

module.exports.login = async (req,res) => {
    const {email,password} = req.body;

    let existingUser;
    try {
        existingUser = User.findOne({email:email}, (err,user) => {
            if(err || !user){
                return res.status(400).
                json( !user ? {message:"User not found. SignUp Please"} : {message:err});
            }
            else if(user){
                const isPasswordCorrect = bcrypt.compareSync(password,user.password);

                if(!isPasswordCorrect){
                    return res.status(400).json({message:'Invalid Email / Password'});
                }

                const token = jwt.sign({id:user._id},JWT_SECRET_KEY,{expiresIn:"1hr"});

                return res.status(200).json({message:"Successfully Logged In",user:user,token});

            }
        })
    } catch (error) {
        return new Error(err);
    }
}
module.exports.verifytoken = async (req,res,next) => {

    const headers = req.headers[`authorization`];
    console.log(headers);
    const token = headers.split(" ")[1];
    if(!token){
        res.status(404).json({message:"No Token Found"})
    }
    jwt.verify(String(token),JWT_SECRET_KEY,(err,user) => {
        if(err) {
          return res.status(400).json({message:"Invalid Token"})
        }
    
        console.log(user.id);
        req.id = user.id;
    });
    next();
}

module.exports.profile = (req,res,next) => {
    
    const userId = req.id;
    let user ;
    try {
        User.findById(userId,"-password",(err,user)=> {
            if(!user){
                return res.status(404).json({message:"No user found"});
            }
        
            return res.status(200).json({user});
        });    
    } catch (error) {
        return new Error(error);
    }
    
    
}