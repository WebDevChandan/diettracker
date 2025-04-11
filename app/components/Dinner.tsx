"use client"
import { AllCategory } from "@prisma/client";
import { useDiet } from "../hooks/useDiet";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";

export default function Dinner() {
  const { dinner } = useDiet();

  return (
    <>
      {
        dinner.length > 0 && (
          <>
            <div className="width-full flex justify-between items-center mt-5 mb-1">
              <SubTitle currentCategory={AllCategory.dinner} />
              {/* <Button type="submit" size={"sm"}>Total Nutrients</Button> */}
            </div>
            <DietTracker diet={dinner} currentCategory={AllCategory.dinner} />
          </>
        )
      }
    </>
  )
}
