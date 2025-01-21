"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { LuCirclePlus } from "react-icons/lu";
// import { useDiet } from "../context/DietProvider";
import { useDiet } from "../hook/useDiet";
import DietTracker from "./DietTracker";
import SubTitle from "./SubTitle";

export default function Breakfast() {
  const { breakfast } = useDiet();

  console.log("Got BreakFAst?");
  console.log(breakfast);
  return (
    <>
      <SubTitle label="Breakfast" />
      {/* <DietTracker diet={breakfast} /> */}
    </>

  )
}
