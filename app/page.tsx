import prisma from "@/utils/prisma";
import Breakfast from "./components/Breakfast";
import DietProvider from "./context/DietProvider";
import { Toaster } from "sonner";
import DialogProvider from "@/context/DialogProvider";

const fetchDiet = async () => {
  const DietData = await prisma.foodItem.findMany({
    select: {
      name: true,
      currentWeight: true,
      calories: true,
      protein: true,
      carbs: true,
      fat: true,
      sugar: true,
      amountPer: true,
      category: {
        select: {
          name: true,
        }
      },
    }
  })

  return DietData;
}
export default async function Home() {
  const DietData = await fetchDiet();

  return (
    <DietProvider dietData={DietData} >
      <DialogProvider>
        <Toaster richColors />
        <div id="diet_tracker" className="p-2">
          <h1 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center w-full "> Track Your Diet</h1>

          <Breakfast />
        </div>
      </DialogProvider>
    </DietProvider>
  );
}
