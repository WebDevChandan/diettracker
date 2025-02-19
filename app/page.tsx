import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";
import { Toaster } from "sonner";
import Breakfast from "./components/Breakfast";
import Lunch from "./components/Lunch";
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
      <div id="diet_tracker" className="p-2">
        <h1 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center w-full "> Track Your Diet</h1>
        <Breakfast />
        <Lunch />
      </div>
    </DietProvider>
  );
}
