//Route=It's the part you type after your website’s domain.Defines a single path like /login.When someone visits your app (like typing a URL then clicking a button), that request needs to go somewhere. That “somewhere” is a route.eg-https://studynotion.com/courses here /courses is a route
//Controller=it is a function that Handles logic for what the route should do
//router =connects a route (URL) to the actual logic (controller) and also adds middlewares if needed.also is needed to group similar routes together.
const express = require("express")
const router = express.Router()
// Import the required controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")
const { auth } = require("../middlewares/auth")
//this auth middleware is not used in signup,login,sendotp,forgot password as the user is not yet logged in.it is used in change password ,bcoz then user has to be logged in 

//                                 Authentication routes 
// Route for user login
router.post("/login", login)
//router.post=This tells Express that you are defining a POST route.POST is used to send data to the server, often for actions like login, creating
//"/login"= this POST route will be triggered when a user visits yourdomain.com/login 
//login= is the controller function that will run when someone hits this route.
//When a user sends a POST request to /login (e.g., when they try to log in),Execute the login function (which handles the login logic).
//login: Authenticates the user by checking email and password, then generates and sends a JWT token for session management.

// Route for user signup
router.post("/signUp", signUp)
//signUp: Registers a new user by validating inputs, verifying OTP, hashing the password, and saving the user to the database

// Route for sending OTP to the user's email
router.post("/sendOTP", sendOTP)
//sendOTP: Generates and sends a unique OTP to the user’s email for verification during signup or password reset.

// Route for Changing the password
router.post("/changepassword", auth, changePassword)
//auth=It typically checks if the user is logged in, by verifying a JWT token.
//changePassword: Allows the user to change their password after validating the old password and ensuring the new password is different and matching. It also sends a confirmation email after the password is updated.

//                                     Reset Password

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)
//resetPasswordToken:Generates a unique token for the user to reset their password, stores it in the database with an expiration time, and sends a reset link to the user's email.

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)
//resetPassword:Validates the reset token, ensures it has not expired, hashes the new password, and updates the user's password in the database.

// Export the router for use in the main application
module.exports = router;