const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
//there will be many courses related to one category
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
})
module.exports=mongoose.model("Category",categorySchema);