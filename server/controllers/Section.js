const Section=require("../models/Section");
const Course=require("../models/Course");
//now here we are creating a section(section conatins a string and it has sub-sections(videos))we need to put the id of the created section into the course and also put the id of the subsection into the section
exports.createSection=async function(req,res){
    try{
        //fetch data->string(section name)and the id of course in which this section is needed to be inserted 
        const {sectionName,courseId}=req.body;
        //data validation->we require both of the data
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:"missing details"
            })
        }
        //create the section by adding the string in db
        const newSection=await Section.create({sectionName});
        //update the course with the section objectid 
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                        courseContent:newSection._id,       
                }
            },{new:true}
        ).populate({
            path: "courseContent",//Populates the courseContent field
            populate: {
                path: "subSection",//Populates the subSection field within courseContent
            },
        }).exec();
//use populate to replace sections/subsections both in updatedCourseDetails      
//see if this is correct or not
        return res.status(200).json({
            success:true,
            message:'section created successfully',
            updatedCourseDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'unable to create section plz try again',
            error:error.message,    
        })
    }
}
//now the user has to update the section-name well section is just a string so update this only but we need to know which section is needed to be updated
exports.updateSection=async function(req,res){
    try{
        //data input
        const {sectionName,sectionId}=req.body;
        //validate data->we need both
        if(!sectionName|| !sectionId){
            return res.status(400).status({
                success:false,
                message:"missing properties"
            })
        }
        //update section name
        const section=await Section.findByIdAndUpdate(sectionId,{
            sectionName:sectionName
        },{new:true})
        //return res
        return res.status(200).json({
            success:true,
            message:"section updated successfullly"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to do section updation"
        })
    }
}
exports.deleteSection=async function(req,res){
    try{
//get id of that section to be deleted assuming we are sending id in params
        const {courseId,sectionId}=req.body;

        await Course.findByIdAndUpdate(courseId, {
            $pull: { courseContent: sectionId }
          });
          
        await Section.findByIdAndDelete(sectionId);
        
//todo(testing)->do we need to delete the entry from the course schema
        return res.status(200).json({
            success:true,
            message:"section deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete section",
            error:error.message
        })
    }
}