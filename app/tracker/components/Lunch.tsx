"use client"
import { AllCategory } from "@prisma/client";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";
import { useDiet } from "../hook/useDiet";

export default function Lunch() {
  const { lunch } = useDiet();

  return (
    <>
      {
        lunch.length > 0 && (
          <>
            <div className="width-full flex justify-between items-center mt-5 mb-1">
              <SubTitle currentCategory={AllCategory.lunch} />
              {/* <Button type="submit" size={"sm"}>Total Nutrients</Button> */}
            </div>
            <DietTracker diet={lunch} currentCategory={AllCategory.lunch} />
          </>
        )
      }
    </>
  )
}
