import React from 'react'
import { FaArrowRight } from "react-icons/fa"// for importing icons
import { Link } from "react-router-dom"
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/Button'
import Banner from '../assets/images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from "../components/core/HomePage/InstructorSection"
const Home = () => {
    return (
        <div>
            {/* section 1 */}
            <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent'>
                {/*relative=Sets position relative(used for positioning child elements later).mx-auto=Horizontal margins centers the div left-right,Width = 11/12 of its parent (almost full width),items-center→ Aligns children horizontally center (cross axis) justify-between= Puts space between children (top to bottom in this case*/}
                <Link to={"/signup"}>
                    {/* <Link> → A special tag from React Router used instead of <a>It doesn’t reload the page; it changes the route smoothly.to={"/signup"} → Tells React Router to go to the /signup route when clicked */}
                    <div className='group mt-16 p-1 bg-richblack-800 rounded-full font-hold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                        <div className='flex flex-row items-center gap-4 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                            <p>Become an Instructor </p>
                            <FaArrowRight />
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
                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>
                <div className='mx-3 my-12 shadow-blue-200'>
                    <video
                        muted
                        loop
                        autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>
                {/* code section 1 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock Your
                                <HighlightText text={"coding potential "} />
                                with our online courses
                            </div>
                        }
                        subheading={
                            " Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={{
                            btnText: "Try it Yourself",
                            linkto: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            linkto: "/login",
                            active: false,
                        }}
                        codeblock={
                            `<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\nh1><ahref="/">Header</a>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`
                        }
                        codeColor={"text-yellow-25"}
                    />
                </div>

                {/* code section 2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Start
                                <HighlightText text={"coding in seconds. "} />
                            </div>
                        }
                        subheading={
                            " Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={{
                            btnText: "Continue Lesson",
                            linkto: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            linkto: "/login",
                            active: false,
                        }}
                        codeblock={
                            `<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\nh1><ahref="/">Header</a>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`
                        }
                        codeColor={"text-yellow-25"}
                    />
                </div>
            </div>
            {/* section 2 */}
            <div className='bg-pure-greys-5 text-richblack-700'>
                <div className='homepage_bg h-[310px]'>
                    <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
                        <div className='h-[150px]'></div>
                        <div className='flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex items-center gap-3'>
                            Explore Full Catalog
                            <FaArrowRight></FaArrowRight>
                        </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                        <div>Learn More</div>
                        </CTAButton>
                        </div>
                    </div>
                </div>
                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                    <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the skills you need for a 
                            <HighlightText text={"Job that is in demand"} />
                        </div>
                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                        <div className='text-[17px]'>
                        The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                        </div>
                    </div>
                    <TimelineSection></TimelineSection>
                    <LearningLanguageSection></LearningLanguageSection>
                </div>
            </div>
  {/* section 3 */}
  <div className='w-11/12 mx-auto flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
        <InstructorSection></InstructorSection>
        <h2 className='text-center text-4xl font-symibold mt-10'>Review from other Learners</h2>
  </div>
        </div>
    )
}
export default Home