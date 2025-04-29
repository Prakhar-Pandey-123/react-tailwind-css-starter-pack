const bcrypt = require("bcrypt");
const User=require("../models/User");
const crypto=require("crypto");
const mailSender=require("../utils/mailSender");
//when user clicks on the reset password button then generate a link ,send the link by email,when user opens it then a frontend should open(link is of frontend)where user can type the new password
//so if some one gets the link with the token and the token is matched with the token saved in db and it is same then when we submit new password then the password of the user containing that token will be changed , thats why we need token.the token acts as a temporary secret key to confirm the identity of the user during the password reset process.
//lets say there are 2 users and both ask for reset password and same url(without any token) is send to both the users then both will send the new password then system will not know whose password it has to change 
//the token is created not to protect the process from hackers but rather to tell the server whose password it need to reset
exports.resetPasswordToken=async function(req,res){
   try{
     //get email from req body
     const email=req.body.email;
     //check user for this email
     const user=await User.findOne({email:email});
     if(!user){
         return res.status(401).json({
             success:false,
             message:"UR EMAIL is not registered"
         })
     }
 //generate token,this will generate a random ID which we can use as our token 36b8f84d-df4e-4d49-b662-bcde71a8764f
     const token=crypto.randomUUID();
     //update User by adding token and expiry time
     const updateDetails=await User.findOneAndUpdate({email:email},//find the info in db by this email
         {//now the updation part that need to be done
             token:token,
             resetPasswordExpires:Date.now()+5*60*1000,
//will expire in 5 minutes Date.now() in JavaScript gives you the current timestamp in milliseconds since January 1, 1970,
         },{new:true}//new data will go to the updateDetails var if u didnt typed this then old data will go
     )
     //create URL
     const url=`http://localhost:3000/update-password/${token}`;
 //send mail containing the url(email,title,body)
     await mailSender(email,"Password reset link",`Password reset link:${url}`)
     //return response
     return res.status(200).json({
         success:true,
         message:"EMAIL sent successfully"
     })
   }
   catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"cant send email for reset pwd"
    })
   }
}
//resetPassword
exports.resetPassword=async function(req,res){
    try{
        //fetch data(new pwd,cnf pwd, token)
//u might be thinking i have sent the token in url to frontend how it came to req well because frontend have done it
//now this token will be used by server to know whose password need to be changed
    const {password,confirmPassword,token}=req.body;
    //validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"password not matching"
            })
        }
    //get user details from db using token->that was the purpose of creating token
        const userDetails=await User.findOne({token:token});
    //if no entry-invalid user
    if(!userDetails){
        return res.json({
            success:false,
            message:"token is invalid"
        })
    }
    //token has expired//lets say token was create at 5:00 and will expire on 5:05 and now its 6:00 so Date.now()>expiry time set 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"token expired,please generate ur new token"
            })
        }
    //hash pwd
        const hashedPassword=await bcrypt.hash(password,10);
    //password update
        await User.findOneAndUpdate({token:token},{
            password:hashedPassword
        },{new:true}); 
    //return response
    return res.status(200).json({
        success:true,
        message:"Password reset successful"
    })
    }
    catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            message:"something went wrong while reseting pwd"
        })
    }
}