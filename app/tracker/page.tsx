import DialogProvider from "@/app/context/DialogProvider";
import { Button } from "@/components/ui/button";
import { DietType } from "@/types/Diet";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import UserGoalProvider, { existedUserGoalType } from "../context/UserGoalProvider";
import Breakfast from "./components/Breakfast";
import Dinner from "./components/Dinner";
import Lunch from "./components/Lunch";
import NewFoodItem from "./components/NewFoodItem";
import { SpeedDial } from "./components/SpeedDial";
import DietProvider from "./context/DietProvider";
import { UploadFileDialog } from "./components/UploadFileDialog";
import UploadFileProvider from "./context/UploadFileProvider";
import { cookies } from "next/headers";
import { saveGoal } from "../goal/server/goal.action";

const fetchUserData = async (userEmail: string) => {
    try {
        const data = await prisma.user.findFirst({
            where: {
                email: userEmail
            },
            select: {
                diet: true,
                UserFitness: {
                    select: {
                        id: true,
                        profile: true,
                        goal: true,
                    }
                }
            }
        }).then((user) => user);

        return {
            DietData: data?.diet,
            UserFitness: data?.UserFitness
        };

    } catch (error) {
        console.log("Error Fetching skill Data: ", error);
    }
}

export default async function Home() {
    const userEmail = await fetchUserEmail();

    if (!userEmail) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-xl font-semibold">Please sign in to continue</h2>
            </div>
        )
    }

    const { DietData, UserFitness } = await fetchUserData(userEmail) as { DietData: DietType, UserFitness: existedUserGoalType };

    const cookie = await cookies();
    const userFitnessData = cookie.get("userFitnessData")?.value;

    if (userFitnessData && !UserFitness) {
        const parseUserFitnessData = JSON.parse(userFitnessData);

        await saveGoal(parseUserFitnessData, userEmail);
    }


    return (
        <DietProvider dietData={DietData ? DietData : []}>
            <UserGoalProvider existeUserGoalData={UserFitness ? UserFitness : undefined}>
                <DialogProvider>
                    <UploadFileProvider>
                        <div id="diet_tracker" className="p-2 relative mt-14 sm:mt-8" >
                            <div className="container mx-auto px-4">
                                <h1 className="text-2xl mb-2 font-bold text-secondary-foreground sm:truncate sm:text-3xl sm:tracking-tight text-center w-full "> Food Nutrition Tracker</h1>
                                <p className="text-sm text-muted-foreground text-center sm:text-lg">
                                    Track your food intake and nutritional information with ease.
                                </p>
                            </div>
                            {DietData?.length
                                ?
                                (<>
                                    <Breakfast />
                                    <Lunch />
                                    <Dinner />
                                    <SpeedDial />
                                </>)
                                :
                                (<div className="flex items-center justify-center min-h-[50vh]">
                                    <NewFoodItem
                                        title="Add Food Item"
                                        currentCategory={[]}
                                        triggerElement={
                                            <Button
                                                size="lg"
                                                className="flex items-center gap-2 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <Plus className="h-6 w-6" />
                                                Add Food Item
                                            </Button>}
                                    />
                                </div>)
                            }
                            <UploadFileDialog />
                        </div>
                    </UploadFileProvider>
                </DialogProvider>
            </UserGoalProvider>
        </DietProvider>
    );
}
