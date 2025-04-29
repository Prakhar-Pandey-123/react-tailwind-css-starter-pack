const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const mongoose=require("mongoose")
//create Rating and review by the user for a course
exports.createRating=async function(req,res) {
    try{
//get user id,we attached payload with the token and in auth we deattached it and put the payload in req body
        let userId=req.user.id;
        //fetch data from req body
        userId = new mongoose.Types.ObjectId(userId)
        const {rating,review,courseId}=req.body;
        //check if the user is enrolled or not
        const courseDetails=await Course.findOne({
            _id:courseId,
            studentsEnrolled:{elemMatch:{$eq:userId}},
        });
//$elemMatch checks if at least one element in the studentsEnrolled array matches the given condition.$eq specifies the exact value to match against an element
//only if the user is inthe course then he can review else not
        if(!courseDetails){
            return res.status(404).json({
              success:false,
              message:"student is not enrolled in course"  
            })
        }
//check if user already reviewed the course,user cant review more than once
        const alreadyReviewed=await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"course is already reviewed by the user"
            });
        }
//create rating and review
    const ratingReview=await RatingAndReview.create({
        rating,review,
        course:courseId,user:userId
    })
//update course with this rating/review
 const updateCourseDetails=await Course.findByIdAndUpdate(courseId,{
        $push:{
            ratingAndReviews:ratingReview._id,
        }
    },{new:true})
    console.log(updateCourseDetails);
    //return response
    return res.status(200).json({
        success:true,
        message:"rating review created successfully",
        ratingReview,
    })
    }   
    catch(error){
        return res.status(500).json({
            success:false,
            message:"cant create rating review",
            error:error.message
        })
    } 
}
//get Average rating for a course
exports.getAverageRating=async (req,res)=>{
    try{
        //get course id
        const courseId=req.body.courseId;
        //calculate avg rating
//RatingAndReview.aggregate:Executes an aggregation pipeline on the RatingAndReview collection
        const result=await RatingAndReview.aggregate([
            {
//$match:Filters documents where the course field matches the given courseId converted to a object(from string) it by mongoose.Types.ObjectId.
                $match:{course:new mongoose.Types.ObjectId(courseId)},
            },
            {
//$group:Groups the filtered documents together ._id: null: Groups all documents into a single group (no further subdivision by a specific key).
                $group:{
                    _id:null,
//averageRating field: Calculates the average of the rating field across the grouped documents by use of $avg operator
                    averageRating:{ $avg:"$rating" }
                }
            }
        ])
//Result format:The output is an array with (one) object, containing _id: null and the calculated averageRating.
        if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating
        })
        }
        //if no rating exists(not yet rated)
        return res.status(200).json({
            success:true,
            message:"avg rating is 0,no rating given till now",
            averageRating:0,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
//get all the ratings and reviews ever given
exports.getAllRating=async function(req,res){
    try{
        const allReviews=await RatingAndReview.find({}).sort({rating:"desc"})
//sorts the reviews by their rating in descending order.
        .populate({
            path:"user",
            select:"firstName lastName email image"
//retrieves user data, selecting only the firstName, lastName, email, and image fields.
        }).populate({
            path:"course",
            select:"courseName",
        }).exec()
// retrieves the associated course data, selecting the courseName field.
//.exec() executes the query and returns the result as a promise.
        return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allReviews
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}