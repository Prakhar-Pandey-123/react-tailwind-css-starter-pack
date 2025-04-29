const mongoose=require("mongoose");

const sectionSchema=new mongoose.Schema({
    sectionName:{
        type:String
    },
    subSection:[{// an array there wont be just one subsection rather there will be many  
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection"
    }]
})
module.exports=mongoose.model("Section",sectionSchema);