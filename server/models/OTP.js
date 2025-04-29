const mailSender = require('../utils/mailSender');//we have done "../" to first nevigate to the parent folder which is server then /utils to go to utils folder then to the mailSender
const mongoose=require("mongoose");

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,//Date->used to store date and time value
        default:Date.now(),//number of milliseconds since 1 jan 1960 if no value send to this then by default it will take the current time
        expire:5*60//the WHOLE data which follows the WHOLE schema gets deleted in 5 minutes
    }
})

//before database entry of the otp made for user,we have to send mail hence use a hook of the mongodb called "pre"->it performs custom check before completing a process
// firstly we need to send the email(otp)to the user then store the otp in our db because what if the process of sending otp fails? then we end up storing wrong otp in our db hence first send otp by node mailer then store the created otp in db then latter match the otp input by user and otp saved in db and check if they matched

//sendverificationEmail fn sends the otp using sendMailer fn defined in utils if email is send then mssg is printed
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"Verification Email from Study Notion",otp)
        console.log("Email send successfully",mailResponse);
     }
    catch(error){
        console.log("error in sending mail",error);
        throw error;
    }
}

//so the use of pre save hook is if the process of sending email fails then the model for that otp is not saved,,if mail send fails then next is not called
//if email is send then next is called and otp is saved

OTPSchema.pre("save",async function(next){//calling above function
    await sendVerificationEmail(this.email,this.otp);
    next();
})
//pre-"save" middleware(hook of mongo)runs before saving("save") the data in db.it calls the sendverificationemail fn passing it the email ,otp ,,this keyword is used to specify the email ,otp of the current user that is going to be saved.next()signals that presave is done and control need go to next middleware or to save the data in db

module.exports=mongoose.model("OTP",OTPSchema);//OTP.js
//user comes to ui->enters data->mail send(OTP)->otp saved in db with the gmail->enters otp->submits->******->db entry of that user in User.js