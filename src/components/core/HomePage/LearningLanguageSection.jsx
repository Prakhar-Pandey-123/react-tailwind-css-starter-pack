import React from "react";
import HighlightText from "./HighlightText";
import knowyourprogress from "../../../assets/images/Know_your_progress.png"
import comparewithothers from "../../../assets/images/Compare_with_others.png"
import planyourlesson from "../../../assets/images/Plan_your_lessons.png"
import CTAButton from "./Button"
const LearningLanguageSection=()=>{
    return(
        <div className="mt-[130px] mb-[60px]">
            <div className="flex flex-col gap-5 items-center">
                <div className="text-4xl font-semibold text-center">
                    Your Swiss knife for
                    <HighlightText text={"learning any language"}/>
                </div>
                <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[70%]">
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                </div>
                <div className="flex flex-row items-center justify-center">
                    <img src={knowyourprogress} className="object-contain -mr-32"></img>
                    <img src={comparewithothers} className="object-contain"></img>
                    <img src={planyourlesson} className="object-contain -ml-36"></img>
                </div>
                <div className="w-fit">
                    <CTAButton active={true} linkto={"/signup"}>
                    <div>
                        Learn More
                    </div>
                    </CTAButton>
                </div>
            </div>

        </div>
    )
}
export default LearningLanguageSection