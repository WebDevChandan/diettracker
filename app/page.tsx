import { Button } from "@/components/ui/button";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import Breakfast from "./components/Breakfast";
import Lunch from "./components/Lunch";
import NewFoodItem from "./components/NewFoodItem";
import { SpeedDial } from "./components/SpeedDial";
import DietProvider from "./context/DietProvider";

const fetchUserDiet = async (userEmail: string) => {
  try {
    const data = await prisma.user.findFirst({
      where: {
        email: userEmail
      },
      select: {
        diet: true,
      }
    }).then(user => user?.diet);

    return data;

  } catch (error) {
    console.log("Error Fetching skill Data: ", error);
  }
}

export default async function Home() {
  const userEmail = await fetchUserEmail();

  if (!userEmail) return <div>Not signed in</div>

  const DietData = await fetchUserDiet(userEmail);

  return (
    <DietProvider dietData={DietData ? DietData : []} >
      <Toaster richColors />
      <div id="diet_tracker" className="p-2" >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl mb-2 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center w-full "> Food Nutrition Tracker</h1>
          <p className="text-lg text-muted-foreground text-center">
            Track your food intake and nutritional information with ease.
          </p>
        </div>
        {DietData?.length
          ?
          (<>
            <Breakfast />
            <Lunch />
            <SpeedDial />

          </>)
          :
          (<div className="flex items-center justify-center min-h-[50vh]">
            <NewFoodItem
              currentCategory={AllCategory.lunch}
              triggerElement={
                <Button
                  size="lg"
                  className="flex items-center gap-2 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-6 w-6" />
                  Add Food Item
                </Button>}
              tooltipText={``}
            />
          </div>)
        }
      </div>
    </DietProvider>
  );
}
