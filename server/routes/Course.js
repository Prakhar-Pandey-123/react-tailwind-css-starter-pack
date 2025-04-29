const express = require("express")
const router = express.Router()
// Course Controllers Import
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
//   getInstructorCourses,
//   editCourse,
//   getFullCourseDetails,
//   deleteCourse,
//   searchCourse,
//   markLectureAsComplete,
} = require("../controllers/Course")
//createCourse=This function creates a new course with details like name, description, price, and category provided by the instructor.
//getAllCourses=Fetches all available courses with their basic details like name, price, instructor, and category.Uses .populate() to replace references (e.g., instructor) with actual data.
//getCourseDetails=Fetches detailed information about a specific course by its ID, including instructor info and course content.Uses .populate() to fetch nested data 
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
  addCourseToCategory,
} = require("../controllers/Categorys")
//createCategory=Allows an admin to create a new course category by providing a name and description.
//showAllCategories=Fetches and displays all available categories with their names and descriptions.
// categoryPageDetails=Shows details of a category, including its courses, other courses from different categories, and popular courses.
//addCourseToCategory=Allows an admin to add an existing course to a category by providing the course and category IDs.
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")
//createSectionCreates a new section (a string with an ID) for a course by providing a section name and course ID.The section ID is then pushed into the courseContent field of the relevant course.
//updateSection=Updates the name of an existing section by providing the new section name and the section's ID.
//deleteSection=Deletes a section from the course and from the Section collection using the provided course ID and section ID.
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")
//createSubSection=Creates a new subsection (video) by uploading the video to Cloudinary and storing its URL.
//updateSubSection=Updates an existing subsection's title by providing the subsection ID, section ID, and the new title.
// deleteSubSection=Deletes a subsection from a section and removes it from the SubSection collection using the provided subsection ID and section ID.
// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview")
//createRating=Verifies the requester is enrolled in the course and hasn’t reviewed it before.Creates a new rating‑and‑review document
//getAllRating=Retrieves every rating‑and‑review, sorted by highest rating.

// const { isDemo } = require("../middlewares/demo");

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

//                                      Course routes


// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)

router.post("/updateSection", auth, isInstructor, updateSection)

router.post("/deleteSection", auth, isInstructor, deleteSection)

router.post("/updateSubSection", auth, isInstructor, updateSubSection)

router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

router.post("/addSubSection", auth, isInstructor, createSubSection)

//is meant to be public data.Anyone—logged in or not—can browse the course catalog, so no auth is req.
router.get("/getAllCourses", showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// Edit a Course
// router.post("/editCourse", auth, isInstructor,isDemo, editCourse)
// Get all Courses of a Specific Instructor
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
//Get full course details
// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Delete a Course
// router.delete("/deleteCourse",auth,isDemo, deleteCourse)
// Search Courses
// router.post("/searchCourse", searchCourse);
//mark lecture as complete
// router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);

router.post("/createCategory", auth, isAdmin, createCategory)
// Category can Only be Created by Admin
router.get("/showAllCategories", showAllCategories)
// Anyone may view it, so no authentication or role check is needed—this keeps the endpoint fast and open.
router.post("/getCategoryPageDetails", categoryPageDetails)
//A visitor (even unauthenticated) can view the courses inside any category, so no auth is required
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);
// Adding a course to a category is an instructor‑only content‑management action. The user must be logged in and possess the Instructor role.

//                                      Rating and Review

router.post("/createRating", auth, isStudent,createRating)
//auth → checks JWT, attaches req.user.isStudent → ensures the authenticated user’s accountType is Student.
router.get("/getAverageRating", getAverageRating)
//Average ratings are public catalogue data; anyone (even not logged in)
router.get("/getReviews", getAllRating)//	Reviews themselves are also public‑facing content.

module.exports = router;