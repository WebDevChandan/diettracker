"use client"
import { Button } from "@/components/ui/button";
import DialogProvider from "@/context/DialogProvider";
import { AllCategory } from "@prisma/client";
import { useDiet } from "../hooks/useDiet";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";

export default function Breakfast() {
  const { breakfast } = useDiet();

  return (
    <DialogProvider>
      <div className="width-full flex justify-between items-center mt-2 mb-1">
        <SubTitle label={AllCategory.breakfast} />
        <Button type="submit" size={"sm"}>Total Nutrients</Button>
      </div>
      <DietTracker diet={breakfast} category={AllCategory.breakfast}/>
    </DialogProvider>
  )
}
