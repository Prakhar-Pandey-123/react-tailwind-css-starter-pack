const User=require("../models/User");
const OTP=require("../models/OTP");
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender")
const {passwordUpdated} =require("../mail/templates/passwordUpdate")
const Profile=require("../models/Profile")
// to import the jwt secret
require("dotenv").config();
//otpGenerator is used to access the functionality of the otp-generator package we can call methods on this var
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");//for hashing password
//function to send OTP
exports.sendOTP=async function(req,res){
    try{
//fetch email id from the body of request
    const {email}=req.body;
//check if user already exist we have to check this by matching the entered email with pre saved emails in db 
    const checkUserPresent=await User.findOne({email});
//if user is already exist then return response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"user already registered"
        })
    }
//generate otp using otpgenrerator using its function .generate
    let otp=otpGenerator.generate(6,{//6->length of otp
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    })
//deafault otp->"Ab4dF7"//digits,uppercase and lowercase letters(special character excluded)
console.log("generated otp is",otp);
//we need to check if otp is unique because if 2 users gets same otp then one user will confirm with the saved otp in db while other could not
//check if unique otp is generated or not
//again create an otp and do it till u find a unique one
    let result=await OTP.findOne({otp:otp})
    console.log(result);
    while(result){
//result==true if found a non unique otp
        otp=otpGenerator(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        result=await OTP.findOne({otp:otp});
    }
//create an entry for otp in db by using .create fn
const otpPayload={email,otp};
const otpBody=await OTP.create(otpPayload);
console.log(otpBody);
//return response successfully
res.status(200).json({
    success:true,
    message:"otp send successfully",
    otp,//otp:otp
})
}
catch(error){
console.log(error);
return res.status(500).json({
    success:false,
    message:error.message,    
})
}
}
//signup request are entertained by this fn()
exports.signUp=async function(req,res){
try{
    //what will come from the frontend by user on signup page
    const {
        firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp
    }=req.body;
//validate if every field is input by the user or not
    if(!firstName|| !lastName|| !email|| !password|| !confirmPassword|| !otp){
//accountType is not included as it is just toggle(it will always be present) 
    return res.status(403).json({
        success:false,
        message:"all fieilds are required"
    })
    }
//check if both the passwords are same
    if(password !==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password and confirm password value dont match"
        })
    }
//"39"===39 ->true // 39=="39"->false
//check if user already exist if yes then no need to sign up just login
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"user already registered"
        });
    }
//find most recent otp stored in db as it might happen that user has asked for more than just one otp then match it with most recent one
//find is a fn provided by db it will return an array of documents while findOne will return only one document .sort({createdAt:-1})will sort the document in descending order(-1)(newest first)if we gave (1)then it will be ascending order .limit(1)will make sure we get only one document  
    const response=await OTP.find({email}).sort({createdAt:-1}).limit(1);
// or const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
//validate the otp input by user and otp saved in db
//[{ createdAt: "2025-04-17" }, // newest{ createdAt: "2025-04-15" },{ createdAt: "2025-04-10" }  // oldest]
  
if(response.length==0){
//if length of array==0 then no otp found in db
    return res.status(400).json({
        success:false,
        message:"OTP Not found in db"
})}//recentOtp will be the document(whole schema)so get the otp
    else if(otp!==response[0].otp){//array of docs
//[{ email: "abc@gmail.com", otp: "5678", createdAt: "2024-01-03" }]
//invalid otp is entered by the user
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        })
    }
//hash the password->converting the password in a fixed length random string this string cannot be reconverted to the password again so even if hacker gets the hash from db he cant get the password .when the user comes and inputs his password then again the password is converted to the same string and matched with the saved string if it matches then user is authentic as we have used a fixed algorithm to hash it
//Bcrypt(hashing)is used during sign-up to hash the user's password before storing it in the database. It ensures that even if the database is compromised, the actual passwords are not exposed.
    const hashedPassword=await bcrypt.hash(password,10);
//10->cost factor(salt round)how many iterations are required to make the hashed string.the more it is the harder it is to hack also will take more time to get created 
//these info not required to befilled at time of sign up but can be filled latter 
let approved="";
approved==="Instructor"?(approved=false):(approved=true);
const profileDetails=await Profile.create({
    gender:null,
    dateOfBirth:null,
    about:null,
    contactNumber:null
})
//create entry of the user profile in db
const user=await User.create({
    firstName:firstName,
    lastName:lastName,
    email:email,
    contactNumber:contactNumber,
    password:hashedPassword,
    accountType:accountType,
    additionalDetails:profileDetails._id,//see this here id is given bcoz we have to send an object(schema model) in this field of the user model
// use tilde bcoz the after dollar will be replaced by var if u use " " it wont work
    image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
//form img by taking first char of first and last name .its an api.api is a way by which 2 diff programs talk to each other and share functionality like u(program1)went to restaurant(program2)then a waiter comes(api)asks for order goes to restaurant and gets ur pizza(functionality)
    })
    return res.status(200).json({
        success:true,
        user,
        message:"user successfully registered"
    })
}
    catch(error){
        console.log(error);
        return res.status(500),json({
            success:true,
            message:"user cannot be registered"
        })
    }
}

// for login functionality
exports.login=async function(req,res){
    try{
//get data from req ki body
        const {email,password}=req.body;
// validate data if all fields entered
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"all fields required"
            })
        }
//check if user exist or not
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered,please sign up"
            })
        }
      
//check password first bcrypt it then compare it with password saved in db at time of sign up
        if(await bcrypt.compare(password,user.password)){
//then create the token
//payload is the user info that is encoded in the token
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            console.log("done with password comparison");
// JWT is used after login. Once the user is authenticated, a JWT is generated and sent to the client. This token is then used for subsequent requests to verify the user's identity without needing to log in again.
//It is sent with every request you make (like opening a page or sending a message).The server checks the token to know who you are and if you’re allowed to do something.
            const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"24h"});
//create cookie and send response
             user.password=undefined;
            user.token=token;//storing token to be send to user
         
//we need to send the user object in response as json(besides message and status) of that particular user trying to login so we can't send the password for security reason hence we undefined it then send it
// setting user.password = undefined only removes the password field from the user object in memory that is being prepared for the response. It does not modify or remove the password stored in the database.(User)
            const options={
                expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true
            }
//Auto-refresh: Some websites refresh the token before it expires, using the cookie A second token (called a refresh token) may be stored in the cookie.It’s used to get a new token without logging in again.Security balance: Short token life = safer.Longer cookie life = better user experience.
//A cookie is a small file the website saves in your browser.The token (your login ID) is often stored inside a cookie.The browser sends this cookie to the server automatically with each request.
            
           return res.cookie("token",token,options).status(200).json({
                success:true,
                token:token,
                user:user,
                message:"Logged in successfully"
            })
        }
//after the token expires in 24 hrs the user has to login again
        else{
            return res.status(401).json({
                success:false,
                message:"password is incorrect"
            })
        }

    }   
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure "
        })
    } 
}
// When the user logs in with their credentials the server bcrypts the password to the same string formed during sign up.If valid, the server creates a JWT that includes:User information (user ID, email,role).Additional claims like token expiration time (exp) A signature generated using a secret key (JWT_SECRET)The server does not store the token. Instead, the token is sent to the client (browser) and stored on the client side.When the user revisits the website or makes further requests, the client sends the token (usually in the Authorization header) to the server. Server Verification (Stateless):The server decodes and verifies the token using the secret key that was used to sign it.It checks:The token's integrity (whether it has been tampered with). Whether it has expired (exp claim).If the token is valid, the user is authenticated, and access is granted.By expiring tokens regularly, the risk is minimized, as the stolen token will eventually become unusable.
//change password
exports.changePassword=async function(req,res){
    try{
//get data from req body oldPassword,newPassword,confirmNewPassword
    const userDetails=User.findById(req.body.id)
    const {oldPassword,newPassword,confirmNewPassword}=req.body;
  //validation old password if its really the real old password?
  const isPasswordMatch=await bcrypt.compare(oldPassword,userDetails.password);
  //u have to change password so new password should be diff
    if(oldPassword===newPassword){
        return res.stats(400).json({
            success:false,
            message:"new password cannot be same as old password"
        })
    }
    if(!isPasswordMatch){
        return res.status(401).json({
            success:false,
            message:"password is incorrect"
        })
    }
    //all details are not entered
  if(!oldPassword || !newPassword|| !confirmNewPassword){
    return res.status(403).json({
        success:false,
        message:"enter all deatils"
    })
  }
  //if new password and confirm new password do not match 
  if(newPassword!==confirmNewPassword){
    return res.status(400).json({
        success:false,
        message:"new and confirm password should be same"
    })
  }
    //update pwd in db
    const encryptedPassword=await bcrypt.hash(newPassword,10);
    const updatedUserDetails=await User.findByIdAndUpdate(req.user.id,{
        password:encryptedPassword,
    },{new:true})
    //send mail that we updated password
    try {
        const emailResponse=await mailSender(updatedUserDetails.email,"study Notion- password updated",passwordUpdated(updatedUserDetails.email,`password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`))
        console.log("email sent for password updation")
    } catch (error) {
        //if there is some error to send mail
        console.log("error at sending updated password mail",error);
        return res.status(500).json({
            success:false,
            message:"cant send email",
            error:error.message,
        })        
    }
    // return success response 
    return res.status(200).json({
        success:true,
        message:" password updated successfully",
        error:error.message,
    })        
}
catch(error){
    console.log("error at pass updation",error);
    return res.status(500).json({
        success:false,
        message:"cant update password",
        error:error.message,
    })        
}
};