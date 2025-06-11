import { fetchUserEmail } from "@/utils/fetchUserEmail";
import { cache } from "react";
import UserGoalProvider from "../context/UserGoalProvider";
import { GoalForm } from "./components/Goal-Form";
import { fetchExistedUserGoal } from "./server/goal.action";

const fetchCachedUserEmail = cache(async () => {
    return await fetchUserEmail();
});

const fetchCachedUserGoal = cache(async (email: string | null) => {
    if (!email) return undefined;

    return await fetchExistedUserGoal(email);
});

export default async function GoalPage() {
    const userEmail = await fetchCachedUserEmail();

    const existedUserGoal = await fetchCachedUserGoal(userEmail ?? null);

    return (
        <UserGoalProvider existeUserGoalData={existedUserGoal ? existedUserGoal : undefined}>
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
                <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                    <div className="max-w-3xl mx-auto mt-14 sm:mt-8">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                                {userEmail ? "Set Your Weight Loss Goals" : "Find your daily calorie needs"}
                            </h1>
                            <p className="mt-4 text-gray-500 md:text-l/relaxed">
                                Let's calculate your daily calorie needs and set an appropriate deficit for healthy weight loss.
                            </p>
                        </div>
                        <GoalForm />
                    </div>
                </main>
            </div>
        </UserGoalProvider>
    )
}
