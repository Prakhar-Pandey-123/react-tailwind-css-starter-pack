//rsme->require,schema,model,exports
const mongoose=require("mongoose");

const profileSchema= new mongoose.Schema({
    gender:{
        type:String
    },
    about:{
        type:String
    },
    dateOfBirth:{
        type:String
    },
    contactNumber:{
        type:Number,// now this is something new
        trim:true
    }
});
module.exports=mongoose.model("Profile",profileSchema);