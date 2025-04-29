const mongoose=require("mongoose");
//taking instance of mongoose.Connect->your application to a MongoDB database using Mongoose.(mongoose is a bridge b/w node js and mongodb) and also provides some features like find() and save()

require("dotenv").config();
//require->import modules into ur application
//dotenv->store environment values that are imp and sensitive data like API keys and database credentils 
//config->Reads the .env file in your project's root directory.Parses its content into key-value pairs.Loads those pairs into process.env

//By exporting the connect function, you can keep the database connection logic in a separate file. This keeps your code clean and organized, 
//csm->connect-schema-model so here we doing only connect
exports.connect=function(){//function named"connect" is made and then it is attached to exports so that we can export this function to other files .connect is an asynchronous process
    mongoose.connect(process.env.MONGODB_URL,{//to connect mongoose by the url provided in the process.env file
        // useNewUrlParser:true,//tells the mongodb to use new version of mongodb 
       
    })
    .then(function(){//as .connect is asynchronous task
        console.log("DB connected successfully")
    })
    .catch(function(error){// catch block
        console.log("DB connection failed");
        console.log(error);
        process.exit(1);// to exit the process
    })
}
//mongodb+srv://prakhar9704:<db_password>@cluster0.ylpezym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0