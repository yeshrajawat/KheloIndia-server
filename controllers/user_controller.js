const User = require("../model/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { head } = require("../routes");
const { path } = require("express/lib/application");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports.signup =  async (req,res) => {

    const {username,email,password} = req.body;

    let existingUser;

    try {
        existingUser =  User.findOne({email:email},(err,user)=>{
           
            if(err){
                return res.status(400).
                json({message:err});
            }
                if( user){
                        return res.status(202).
                        json( {message:"User already Exists"});
                    
                }
           
           
            if(!user){
                
                const hashedPassword = bcrypt.hashSync(password);
                const user = new User({
                    username,
                    email,
                    password:hashedPassword
                });

                console.log(user);
            
                try {
                     user.save();
                     return res.status(200).json({message:"User Created Successfully",});
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
            if(err){
                return res.status(404).json({message:err})
            }
            
            if(!user){
                return res.status(200).
                json({message:"User not found. SignUp Please"});
            }
            else if(user){
                const isPasswordCorrect = bcrypt.compareSync(password,user.password);

                if(!isPasswordCorrect){
                    return res.status(200).json({message:'Invalid Email / Password'});
                }

                const token = jwt.sign({id:user._id},JWT_SECRET_KEY,{expiresIn:"30s"});
               
                if(req.cookies[`${user._id}`]){
                    req.cookies[`${user._id}`] = "";
               }    
                res.cookie(String(user._id),
                token,
                {path:'/',expires: new Date(Date.now() + 1000 * 30),httpOnly:true,sameSite:'lax'});

                //Http only here is the reason why front end will not be able to see the cookie.
                
               

                return res.status(200).json({message:"Successfully Logged In",user:user,token});

            }
        })
    } catch (error) {
        return new Error(err);
    }
}
module.exports.verifytoken = async (req,res,next) => {

    const cookies = req.headers.cookie;
    console.log(cookies);
    const token = cookies.split("=")[1];
    console.log('cookie',cookies);
    console.log('token',token);
   
    if(!token){
        res.status(404).json({message:"No Token Found"})
    }
    jwt.verify(String(token),JWT_SECRET_KEY,(err,user) => {
        if(err) {
          return res.status(404).json({message:"Invalid Token"})
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
        User.findById(userId,"-password -__v",(err,user)=> {
            if(!user){
                return res.status(404).json({message:"No user found"});
            }
            console.log(user);
            return res.status(200).json({user});
        });    
    } catch (error) {
        return new Error(error);
    }
    
    
}