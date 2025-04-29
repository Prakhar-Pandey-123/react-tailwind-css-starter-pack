//we need to create this so that user can update his profile,profile object is already created when the user sign up but every field of that profile contains null
const Course = require("../models/Course");
const Profile=require("../models/Profile");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
exports.updateProfile=async function(req,res){
    try {
//get data 
const {dateOfBirth="",about="",contactNumber="",gender=""}=req.body
//if we didnt get any input for dateofbirth then it take"" as its value (default value)
//get userId of whose profile is to be updated
    const id=req.user.id;
//so how does id comes in user? ans-> we put it,when we created a token for the user we put id in payload so when user comes and has token then this token is reconverted to payload(decode) hence when user is signed in then he has his user id

//find user then get the details of his profile
    const userDetails=await User.findById(id);
    //get the user id 
    const profileId=userDetails.additionalDetails;
    //get the profile id of that user
    const profileDetails= await Profile.findById(profileId);
//update profile
    profileDetails.dateOfBirth=dateOfBirth;
    profileDetails.about=about;
    profileDetails.gender=gender;
    profileDetails.contactNumber=contactNumber;
    await profileDetails.save();
//When you fetch a document using methods like findById or findOne, the returned object is a Mongoose document instance. Any modifications to its fields are done in memory and not automatically saved to the database. Calling .save() explicitly tells Mongoose to persist these changes.
//return response
    return res.status(200).json({
        success:true,
        message:"profile updated successfully",
        profileDetails,
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"profile cant be updated",
            error:error.message,
        })
    }
}
//now user might think to delete his account we need to first delete his profile then his user id
exports.deleteAccount=async function(req,res){
    try{
        //get user id 
        const id=req.user.id; 
        //lets see if the user exists or not ik its dumb
        const userDetails=await User.findById(id);
        //validation
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        //delete profile first ,we dont need it now
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
//TODO:HW: unenroll user from all enrolled courses
        for(let courseId in userDetails.courses){
            await Course.findByIdAndUpdate(courseId,{
                $pull:{
                    studentsEnrolled:id
                }
            })
        }
        //delete user
        await User.findByIdAndDelete(id);
        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"cant delete the user try again latter"
        })
    }
}
//now lets create a fn which will send all the details of that user/profile
exports.getAllUserDetails=async function(req,res){
    try {
        const id=req.user.id;
        //get user details
        const userDetails=await User.findById(id).populate("additionalDetails").populate("courses").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"user details fetched",
            userDetails:userDetails,
        })    
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user details cant be fetched",
            error:error.message,
        })
    }
}
exports.updateDisplayPicture = async (req, res) => {
	try {
		const id = req.user.id;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
	const image = req.files.pfp;//put>>body>>form-data(it is like a html form)>>set key to pfp and value as a image
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await uploadImageToCloudinary(
		image,
		process.env.FOLDER_NAME
	);
	console.log(uploadDetails);
	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });
    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });	
	} catch (error) {
        console.log(error.message)
		return res.status(500).json({
            success: false,
            message: "can't upload the profile pic",
        });
		
	}
}