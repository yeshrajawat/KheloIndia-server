const User = require("../model/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { head } = require("../routes");
const { path } = require("express/lib/application");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports.signup =   (req,res) => {
    console.log('signup');
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

module.exports.login =  (req,res) => {
    console.log('login');
    const {email,password} = req.body;
    console.log(email,password);
    let existingUser;
    try {
        existingUser = User.findOne({email:email}, (err,user) => {
            if(err){
                console.log('err')
                return res.status(404).json({message:err})
            }
            
            if(!user){
                console.log('User not found.')
                return res.status(200).
                json({message:"User not found. SignUp Please"});
            }
            else if(user){
                const isPasswordCorrect = bcrypt.compareSync(password,user.password);

                if(!isPasswordCorrect){
                    console.log('Invalid Password')
                    return res.status(200).json({message:'Invalid Email / Password'});
                }

                const token = jwt.sign({id:user._id},JWT_SECRET_KEY,{expiresIn:"10m"});
               
                if(req.cookies[`${user._id}`]){
                    console.log(req.cookies);
                    req.cookies[`${user._id}`] = "";
               }    
                res.cookie(String(user._id),
                token,
                {path:'/',expires: new Date(Date.now() + 1000 * 60 * 10),httpOnly:true,sameSite:'lax'});

                //Http only here is the reason why front end will not be able to see the cookie.
                
               
                console.log('Successfully Logged In.')
                return res.status(200).json({message:"Successfully Logged In",user:user,token});

            }
        })
    } catch (error) {
        return new Error(err);
    }
}
module.exports.verifytoken =  (req,res,next) => {
console.log('verifytoken');
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
    console.log('profile');
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

module.exports.logout = (req,res,next) => {
    console.log('logout');
    const cookies = req.headers.cookie;
    const prevToken = cookies.split["="][1];

    if(!prevToken){
        return res.status(400).json({message:"Couldn't find token"});
    }

    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,user)=> {
        if(err) {
            console.log(err);
            return res.status(403).json({message:"Authentication Failed"});
        }
        res.clearCookie(`${user._id}`);
        req.cookies[`${user._id}`] = "";
    })

    return res.status(200).json({message:"Succesfully Logged Out"});

}