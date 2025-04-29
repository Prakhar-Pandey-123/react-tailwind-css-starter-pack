//cloudinary->a cloud based service where u can upload any image or video and u dont need to store in ur db or local storage rather the img will be stored in db of that cloud it also provides other features such as resizing,croping,apply filter,optimizing quality
const cloudinary=require("cloudinary").v2
exports.uploadImageToCloudinary=async function(file,folder,height,quality){
//file-the image u want to upload,folder-the folder name in cloudinary where u want to upload the file.height-(optional)used to define the ht of the img that is saved in cloud.quality-define quality of img uploaded on cloud
    const options={folder:folder};
//creates an obj and adds the name of the folder in cloudinary
    if(height){
//if the height of the img is given then the height field is also saved in the object  
        options.height=height;
    }
    if(quality){
//if the quality of the img is given then the quality field is also saved in the object  
        options.quality=quality;//If quality = 60,then Cloudinary will compress the image to 60% quality.
    }
    options.resource_type="auto";//Cloudinary will automatically detect the type of file (image, video, etc.).
 return await cloudinary.uploader.upload(file.tempFilePath,options)   
}
//file.tempFilePath will contain the PATH of the temporary file stored in the server and the file we will get it from the user in req.file then it will be stored temporarily in server using the middleware express-fileupload and then uploaded to the cloudinary after this,the temp file in server will be deleted automatically by the express-fileupload middleware so as to clean up and get free space on server 
//this function will return a url and a secure_url. url will be the http link to the file uploaded while secure_url will be the https link the file it will be more secure and safe