"use client"
import DialogProvider from "@/context/DialogProvider";
import { AllCategory } from "@prisma/client";
import { useDiet } from "../hooks/useDiet";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";

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
