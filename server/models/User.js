//csm , here we doing s=schema and m=model
//model is basically a way to interact with the mongo data. schema defines the type of data to be stored in db and model provides various functions to do CRUD operation
const mongoose=require("mongoose");
//creating new schema using the keyword "new" named "userSchema"
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,//field is mandatory to be filled.document wont be saved without providing this field
        trim:true,// remove if any extra space 
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],// restricts the value of the input field to be one of the set values 
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,//this field of the object (schema) will contain another object which in it self would be an Schema.types->help mongoose understand the type of data u are dealing with.ObjectId->tells the field will store reference of another document. it will store id of another db doc.it is done to avoid repeatition of data storage 
        required:true,
        ref:"Profile",// name of the model
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }],
    image:{
        type:String,// ofcourse url of img
        required:true,
    },
    token:{//this is a reset password links's token,it is used to tell the server whose password need to be changed
        type:String,
    },
    resetPasswordExpires:{//time at which the reset password link's token expires
        type:Date
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ],
});
module.exports=mongoose.model("User",userSchema);
//module.exports->to export the model .model is a wrapper class to wrap a schema and provide some function like CRUD the name of the schema is "User" and the schema it wraps is userSchema