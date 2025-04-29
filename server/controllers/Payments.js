const mongoose  = require("mongoose");
const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")
const crypto=require("crypto");
//initiate the razorpay order
exports.capturePayment=async (req,res)=>{
    //get courseid and userid(we inserted the userid when logged in as payload)
    const {course_id}=req.body;
    const userId=req.user.id;//When user logs in, we get their ID (userId) as a string from the token (JWT).
    //validation check if its a valid course id
    if(!course_id){
        return res.json({
            success:false,
            message:"please provide valid course id"
        })
    }
    //check valid course datails=if a course like this even exits?
    let course;
    try{
        course=await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"could not find the course"
            })  
        }
//user already paid for the course if yes then user dont have to again pay the money
        //convert user_id(string) to object id
        const uid=new mongoose.Types.ObjectId(userId);
//if u compare a string (user_id) against an ObjectId in the array, and they never match because JavaScript uses strict equality for .includes.
        if(course.studentsEnrolled.includes(uid)){
            return res.json({
                success:false,
                message:"student is already enrolled"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    //create options
    const amount=course.price;
    const currency="INR";
    const options={
        amount:amount*100,//Razorpay requires the amount in the smallest currency unit:For INR (Indian Rupees),the smallest unit is paise.Example: If amount = 500, then amount * 100 = 50000 paise (500 INR).
        currency:currency,
    receipt:Date.now().toString(),//Razorpay uses the receipt field to identify and track specific payment orders.(its optional)
    notes:{//optional//helps us to know which used placed the order and for which course
            courseId:course_id,
            userId:userId,
        }
    }
    //initiate the payment using razorpay.The backend calls Razorpay's API (instance.orders.create) to create a payment order using details like amount, currency, and metadata (options object). It returns an order ID, which uniquely identifies the payment order.
    try{
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);
        //it will show options and an id
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
    }
    catch(error){
        return res.json({
            success:false,
            message:"could not initiate order"
        })
    }
    //return response
}
//so now we have created an instance of rp,then called the order on that instance now it rp work,it will ask bank and ask money when the trasaction is successful it need to give me a secret key so that i know its rp only and is saying the cash is taken,we will match this secret sent by rp with the secret saved in our server
//verify signature

//go and see hmac part from a.txt
exports.verifySignature=async (req,res) => {
    const webhookSecret="12345678";
    //You do not send the webhookSecret to Razorpay.Instead, you give it to Razorpay once in their dashboard/UI when setting up the webhook.
    const signature=req.headers["x-razorpay-signature"];
//x-razorpay-signature is a cryptographic signature sent by Razorpay to ensure the request is from them and has not been tampered with.they took ur secret u given to them at their ui and then converted it to signature by hashing
    const shasum=crypto.createHmac("sha256",webhookSecret);
// creates an HMAC object using the crypto module with the sha256 hashing algorithm and a secret key.This is used to generate a secure hash for validating data integrity
//hmac=hashing(eg-sha256)+secret key
    //convert this object to string now
    shasum.update(JSON.stringify(req.body));

    const digest=shasum.digest("hex");
    //shasum.digest(): Finalizes the HMAC process and generates the hash."hex": Specifies the format of the output, converting the hash into a readable hexadecimal
    if(signature===digest){
        console.log("payment is authorised")
//now if they are same,it means the student has paid the amt,now we need to enroll the user in the course by adding the courseid in user and by adding userid in course of studentsenrolled field
const {courseId,userId}=req.body.payload.payment.entity.notes;
//here these things are put by rp 
        try{
            const enrolledCourse=await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{
                    studentsEnrolled:userId
                }
            },{new:true})
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"course not found"
                })
            }
            console.log(enrolledCourse);
    const enrolledStudent=await User.findOneAndUpdate({_id:userId},{$push:
                        {courses:courseId}                    
             },{new:true})
             console.log(enrolledStudent);
//send confirmation mail to the student that he is enrolled
             const emailResponse=await mailSender(
                enrolledStudent.email,
                "congratulations!!",
                " u are onboarded into new course"
             );
             console.log(emailResponse);
             return res.status(200).json({
                success:true,
                message:"signature verified and course added"
            })
            }
        catch(error){
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:"invalid request"
        })
    }
}