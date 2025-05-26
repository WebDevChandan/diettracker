"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface userFitnessData {
    id: string,
    userEmail: string,
};

export interface existedUserGoalType extends userFitnessData {
    profile: {
        weight: number;
        heightCm: number;
        heightFeet: number;
        heightInches: number;
        age: number;
        weightUnit: string;
        heightUnit: string;
        gender: string;
        activityLevel: string;
        weeklyWeightLoss?: string;
        calorieDeficitPreference?: string;
    },
    goal: {
        bmr: number
        tdee: number
        calorieDeficit: number
        calorieGoal: number
        nutrients: {
            protein: number
            fat: number
            carbs: number
            sugar: number
        }
    }
}

interface UserGoalContextType {
    existedUserGoal?: existedUserGoalType,
    setExistedUserGoal: Dispatch<SetStateAction<existedUserGoalType | undefined>>,
};

export const UserGoalContext = createContext<UserGoalContextType>({
    existedUserGoal: {
        id: "",
        userEmail: "",
        profile: {
            weight: 80,
            heightCm: 170,
            heightFeet: 5,
            heightInches: 6,
            age: 25,
            weightUnit: "kg",
            heightUnit: "cm",
            gender: "male",
            activityLevel: "1.2",
            weeklyWeightLoss: "",
            calorieDeficitPreference: "",
        },
        goal: {
            bmr: 0,
            tdee: 0,
            calorieDeficit: 0,
            calorieGoal: 0,
            nutrients: {
                protein: 0,
                fat: 0,
                carbs: 0,
                sugar: 0
            }
        },
    },
    setExistedUserGoal: () => { },

});

export default function UserGoalProvider({ existeUserGoalData, children }: {
    existeUserGoalData?: existedUserGoalType, children: ReactNode
}) {
    const [existedUserGoal, setExistedUserGoal] = useState(existeUserGoalData);

    return (
        <UserGoalContext.Provider value={{
            existedUserGoal,
            setExistedUserGoal
        }}>
            {children}
        </UserGoalContext.Provider >
    )
}
