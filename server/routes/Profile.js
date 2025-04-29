const express = require("express")
const router = express.Router()
const { auth
  // ,isInstructor
 } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  // getEnrolledCourses,
  // instructorDashboard,
} = require("../controllers/Profile")
//auth=It typically checks if the user is logged in, by verifying a JWT token.
//                                      Profile routes

router.delete("/deleteProfile", auth, deleteAccount)
//This defines a DELETE route using Express.middleware function that checks if the user is logged in (authenticated).Deletes a user's account and their profile from the database.Also removes the user from all courses they were enrolled in.It runs only after the auth middleware confirms the user is valid.

router.put("/updateProfile", auth, updateProfile)
//PUT is used to update an existing resource, in this case, the user profile.User sends a PUT request to /updateProfile with their updated profile data.auth middleware first checks if the user is authenticated by verifying their JWT token.updateProfile is called:It updates the user’s profile based on the data sent in the request body.
router.get("/getUserDetails", auth, getAllUserDetails)
//Fetches full details of the logged-in user.Uses .populate() to also fetch data from linked profile and courses
// Get Enrolled Courses

// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router