// Authentication:"Who are you?" Authorization:"What can you do?"
const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");
//auth->check the authentication by checking is token is correct
exports.auth=async function(req,res,next){
    try{
        //extract token maybe be found from 3 places-
        const token=req.cookies.token|| req.body.token    
        ||req.headers("Authorisation").replace("Bearer ","");
        //if token is missing,then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"
            })
        }
//verify->converting the token again to the user info also requires the secret key
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;//you're attaching that user info to the current request.so u can use req in isStudent middleware
            //req.user will contain the decoded payload which in turn will contain accounttype
// req.user is a property added to the request object in Express after user authentication, usually by a middleware. decode is same as the payload that we have attached to the token earlier in login page 
        }//verification issue
        catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();//go to next middleware
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validation"
        })
    }
}
//isStudent..req.user will contain the decoded payload which in turn will contain accounttype
exports.isStudent=async function(req,res,next){
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"this route is for students only"
            })    
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified"
        })
    }
}
//isInstructor
exports.isInstructor=async function(req,res,next){
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"this route is for Instructor only"
            })    
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified"
        })
    }
}
//isAdmin
exports.isAdmin=async function(req,res,next){
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this route is for Admin only"
            })    
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified"
        })
    }
}
//isAdmin middleware checks if the authenticated user req.user has an account property set to Admin. If not, it returns a `401` status with a message saying the route is only for admins. If the user is an admin, the middleware calls `next()` to allow the request to continue