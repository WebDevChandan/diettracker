import UserGoalProvider from "@/app/context/UserGoalProvider";
import { GoalForm } from "../../goal/components/Goal-Form";

export default function page() {
    return (
        <UserGoalProvider>
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col pt-8">
                <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                    <div className="max-w-3xl mx-auto mt-10 sm:mt-8">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                                Find your daily calorie needs
                            </h1>
                            <p className="mt-4 text-gray-500 md:text-l/relaxed">
                                Let's calculate your daily calorie needs and set an appropriate deficit for healthy weight loss.
                            </p>
                        </div>
                        <GoalForm isGoalForm={false} />
                    </div>
                </main>
            </div>
        </UserGoalProvider>
    )
}
