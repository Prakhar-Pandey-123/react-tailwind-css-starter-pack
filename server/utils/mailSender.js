//nodemailer is a nodejs library used to connect the service of sending emails with ur application
//firstly u have to create a tansporter it is used to get the password and sign in to the gamil account from where u want to send the gmail
const nodemailer=require("nodemailer");

const mailSender=async function(email,title,body){
//email->receivers address, title->title of the email
   try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,//this line is used to specify the PLATFORM(GMAIL, or any other) from which we are sending email 
            auth:{
                user:process.env.MAIL_USER,//gets the email id from where the email need to be send by the help of dotenv file
                pass:process.env.MAIL_PASS,//gets the password of the account from where the email need to be send(host)
            }
        })
//sendMail is a fn provided by transporter to send the email
        let info=await transporter.sendMail({
            from:"Study Notion || Prakhar Pandey",//receiver will see this as the sender
            to:`${email}`,//email of the receiver this email we took in the mailSender fn()
            subject:`${title}`,
            html:`${body}`//the receiver will see the content(otp) of email in form of html
        })
        console.log(info);
        return info;
}
catch(error){
    console.log(error.message);
}
}
module.exports=mailSender;