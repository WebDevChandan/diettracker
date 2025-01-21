"use client"
import { useDiet } from "../hook/useDiet";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";

export default function Breakfast() {
  const { breakfast } = useDiet();

  return (
    <>
      <SubTitle label="Breakfast" />
      <DietTracker diet={breakfast} />
    </>
  )
}
