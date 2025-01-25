"use client"
import { AllCategory } from "@prisma/client";
import { useDiet } from "../hooks/useDiet";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";
import DialogProvider from "@/context/DialogProvider";

export default function Breakfast() {
  const { breakfast } = useDiet();

  return (
    <DialogProvider>
      <SubTitle label={AllCategory.breakfast} />
      <DietTracker diet={breakfast} />
    </DialogProvider>
  )
}
