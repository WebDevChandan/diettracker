import { DietData } from "@/public/data/SeedData";
import Breakfast from "./components/Breakfast";
import DietProvider from "./context/DietProvider";

export default function Home() {
  return (
    <DietProvider dietData={DietData} >
      <div id="diet_tracker" className="p-2">
        <h1 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center w-full "> Track Your Diet</h1>

        <Breakfast />
      </div>
    </DietProvider>
  );
}
