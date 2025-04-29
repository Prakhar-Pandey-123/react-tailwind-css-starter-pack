//We import everything in index.js because it is the main starting file of the backend app
const express=require("express");
const app=express();

const userRoutes=require("./routes/User");
//Inside the User.js file (which is inside the routes/ folder), you define the routes for different user-related operations like signup, login, resetPassword, and changePassword. These routes are grouped together in a router.
//In your index.js file, you then import this router and give it a name (userRoutes in this case). You then "mount" this router onto a specific path (like /api/v1/auth), meaning all the routes inside the userRoutes will be prefixed with /api/v1/auth(same prefix)
const profileRoutes=require("./routes/Profile");
const courseRoutes=require("./routes/Course");
const contactusRoutes=require("./routes/ContactUs");

const database=require("./config/database");
//By importing and running database() in index.js, you're making sure that the database connection is established before your app starts handling requests.
const cookieParser=require("cookie-parser");//without cookie parser we can not use cookie which is important for authentication
//frontend=3000,backend=4000 and to let backend enteratin req of frontend we need cors
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary")
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");
require("dotenv").config();

const PORT=process.env.PORT || 4000;
database.connect();
app.use(express.json());
//is used to parse incoming JSON data from the request body,without backend cant understand json object send by frontend
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,//Frontend can send cookies (like token for login)Backend accepts those cookies
    })
)//exntertain request from port 3000
app.use(
    fileUpload({
        useTempFiles:true,//Files will be stored temporarily on disk instead of memory.
        tempFileDir:"/tmp"//Sets the temporary folder (/tmp) to hold uploaded files before processing them 
    })
)
cloudinaryConnect();
//mount the routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/contactUs",contactusRoutes);
//default route for home page
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is up and running..."
    })
})
//active the server
app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`)
});