import React from 'react'
import {FaArrowRight} from "react-icons/fa"// for importing icons
import {Link} from "react-router-dom"
import HighlightText from '../components/core/HomePage/HighlightText'
const Home = ()=>{
    return (
        <div>
            {/* section 1 */}
            <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent'>
{/*relative=Sets position relative(used for positioning child elements later).mx-auto=Horizontal margins centers the div left-right,Width = 11/12 of its parent (almost full width),items-center→ Aligns children horizontally center (cross axis) justify-between= Puts space between children (top to bottom in this case*/}
            <Link to={"/signup"}>
{/* <Link> → A special tag from React Router used instead of <a>It doesn’t reload the page; it changes the route smoothly.to={"/signup"} → Tells React Router to go to the /signup route when clicked */}
                <div className='group mt-16 p-1 bg-richblack-800 rounded-full font-hold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor </p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>
            <div className='text-center text-4xl font-semibold mt-7'>
                Empower Your Future with 
                <HighlightText text={"Coding Skills"}></HighlightText>
                {/* its a component which takes a text and changes it color */}
            </div>
            <div className='w-[90%] mt-4 text-center text-lg font-bold text-richblack-300'>
                With our online coding course, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on project, quizess, and personalized feedback from instructors.
            </div>
            </div>
            {/* section 2 */}

            {/* section 3 */}

        </div>
    )
}
export default Home