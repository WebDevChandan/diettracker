"use client"
import { AllCategory } from "@prisma/client";
import { useDiet } from "../hooks/useDiet";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";

export default function Breakfast() {
  const { breakfast } = useDiet();

  return (
    <>
      <SubTitle label={AllCategory.breakfast} />
      <DietTracker diet={breakfast} />
    </>
  )
}
