"use server"
import { fetchUserEmail } from "@/utils/fetchUserEmail"
import prisma from "@/utils/prisma"
import { revalidatePath } from "next/cache"
import { z, ZodError } from "zod"
import { UserFitnessType } from "../components/Goal-Form"
import { cookies } from "next/headers"

//Schema for FitnessProfile validation
const userFitnessProfileFormSchema = z.object({
    weight: z.number().positive().min(10, "Should be at least 10"),
    weightUnit: z.enum(["kg", "lbs"], { message: "Invlid WeightUnit" }),
    heightCm: z.number().positive().min(10, "Should be at least 10"),
    heightFeet: z.number().nonnegative().min(1, "Should be at least 1"),
    heightInches: z.number().nonnegative(),
    heightUnit: z.enum(["cm", "ft"], { message: "Invlid HeightUnit" }),
    age: z.number().positive().int().min(18).max(100),
    gender: z.enum(["male", "female"], { message: "Invlid Gender Value" }),
    activityLevel: z.enum(["1.2", "1.375", "1.55", "1.725", "1.9"], { message: "Invlid ActivityLevel Value" }),
    weeklyWeightLoss: z.enum(["0.25", "0.5", "1", ""], { message: "Invlid WeightLoss Value" }).optional(),
    calorieDeficitPreference: z.enum(["mild", "moderate", "aggressive"], { message: "Invlid Preference Value" }).optional(),
})

export type userFitnessProfileFormValues = z.infer<typeof userFitnessProfileFormSchema>

export async function fetchGoal(formData: userFitnessProfileFormValues) {
    try {
        const validatedData = userFitnessProfileFormSchema.parse(formData);

        // Convert weight to kg if needed
        let weightInKg = validatedData.weight
        if (validatedData.weightUnit === "lbs") {
            weightInKg = Number.parseFloat((validatedData.weight * 0.45359237).toFixed(1));
        }

        let heightInCm = 0
        if (validatedData.heightUnit === "cm" && validatedData.heightCm) {
            heightInCm = validatedData.heightCm
        } else if (
            validatedData.heightUnit === "ft" &&
            validatedData.heightFeet !== undefined &&
            validatedData.heightInches !== undefined
        ) {
            heightInCm = ((validatedData.heightFeet * 12) + validatedData.heightInches) * 2.54;
        }

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr = 0
        if (validatedData.gender === "male") {
            bmr = ((10 * weightInKg) + (6.25 * heightInCm) - (5 * validatedData.age)) + 5;
        } else {
            bmr = ((10 * weightInKg) + (6.25 * heightInCm) - (5 * validatedData.age)) - 161;
        }

        // Calculate TDEE
        const activityMultiplier = Number.parseFloat(validatedData.activityLevel);
        const tdee = bmr * activityMultiplier;

        // Calculate calorie deficit
        let calorieDeficit = 0

        if (validatedData.weeklyWeightLoss) {
            // 1 kg of fat = approximately 7700 calories
            calorieDeficit = (Number.parseFloat(validatedData.weeklyWeightLoss) * 7700) / 7;

        } else if (validatedData.calorieDeficitPreference) {
            switch (validatedData.calorieDeficitPreference) {
                case "mild": calorieDeficit = 250; break;
                case "moderate": calorieDeficit = 500; break;
                case "aggressive": calorieDeficit = 750; break;
                default: calorieDeficit = 500; // Default if preference is somehow not matched
            }

        } else {
            // Default deficit if neither is specified, e.g., 500 calories
            calorieDeficit = 500;
        }

        // Calculate final calorie goal
        const calorieGoal = Math.round(tdee - calorieDeficit);

        // Calculate nutrient goals based on calorie goal
        const proteinGrams = Math.round((calorieGoal * 0.3) / 4) // 30% of calories, 4 kcal/g
        const fatGrams = Math.round((calorieGoal * 0.25) / 9) // 25% of calories, 9 kcal/g
        const carbsGrams = Math.round((calorieGoal - proteinGrams * 4 - fatGrams * 9) / 4) // Remaining calories / 4 kcal/g
        const sugarGrams = Math.min(Math.round((calorieGoal * 0.1) / 4), 50) // Cap at 10% or 50g


        return {
            success: true,
            data: {
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                calorieDeficit: Math.round(calorieDeficit),
                calorieGoal: calorieGoal,
                nutrients: {
                    protein: proteinGrams,
                    fat: fatGrams,
                    carbs: carbsGrams,
                    sugar: sugarGrams,
                },
            },
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                error: JSON.parse(error.message)[0].message,
            }
        }

        return {
            success: false,
            error: "Failed to save goal. Please check your inputs and try again.",
        }
    }
}

export async function saveGoal(userFitnessData: UserFitnessType, userEmail: string) {
    try {
        if (!userEmail)
            throw new Error(`Please sign-in!`);

        if (!userFitnessData)
            throw new Error(`Re-Calculate Daily Calorie Goal`);

        const validatedData = userFitnessProfileFormSchema.parse(userFitnessData.profile);

        if (!validatedData)
            throw new Error(`Invalid Profile Data`);

        const userGoalExisted = await fetchExistedUserGoal(userEmail);

        if (userGoalExisted?.id) {
            const response = await prisma.userFitness.update({
                where: {
                    userEmail: userEmail,
                },
                data: {
                    profile: {
                        weight: userFitnessData.profile.weight,
                        weightUnit: userFitnessData.profile.weightUnit,
                        heightCm: userFitnessData.profile.heightCm,
                        heightFeet: userFitnessData.profile.heightFeet,
                        heightInches: userFitnessData.profile.heightInches,
                        heightUnit: userFitnessData.profile.heightUnit,
                        age: userFitnessData.profile.age,
                        gender: userFitnessData.profile.gender,
                        activityLevel: userFitnessData.profile.activityLevel,
                        weeklyWeightLoss: userFitnessData.profile.weeklyWeightLoss,
                        calorieDeficitPreference: userFitnessData.profile.calorieDeficitPreference,
                    },
                    goal: {
                        bmr: userFitnessData.goal?.bmr || 0,
                        tdee: userFitnessData.goal?.tdee || 0,
                        calorieDeficit: userFitnessData.goal?.calorieDeficit || 0,
                        calorieGoal: userFitnessData.goal?.calorieGoal || 0,
                        nutrients: {
                            protein: userFitnessData.goal?.nutrients?.protein || 0,
                            fat: userFitnessData.goal?.nutrients?.fat || 0,
                            carbs: userFitnessData.goal?.nutrients?.carbs || 0,
                            sugar: userFitnessData.goal?.nutrients?.sugar || 0,
                        }
                    }
                }

            }).then(() => {
                return {
                    success: true,
                    message: "Goal updated successfully!"
                }
            }).catch((error) => {
                console.log("Error while Updating User Profile & Goal: " + error)

                return {
                    success: false,
                    message: "Goal failed to update!"
                }
            })

            if (response.success) {
                return { message: response.message }

            } else {
                throw new Error(`Failed to updte Goal`);
            }

        } else {
            const response = await prisma.userFitness.create({
                data: {
                    userEmail,
                    profile: {
                        weight: userFitnessData.profile.weight,
                        weightUnit: userFitnessData.profile.weightUnit,
                        heightCm: userFitnessData.profile.heightCm,
                        heightFeet: userFitnessData.profile.heightFeet,
                        heightInches: userFitnessData.profile.heightInches,
                        heightUnit: userFitnessData.profile.heightUnit,
                        age: userFitnessData.profile.age,
                        gender: userFitnessData.profile.gender,
                        activityLevel: userFitnessData.profile.activityLevel,
                        weeklyWeightLoss: userFitnessData.profile.weeklyWeightLoss,
                        calorieDeficitPreference: userFitnessData.profile.calorieDeficitPreference,
                    },
                    goal: {
                        bmr: userFitnessData.goal?.bmr || 0,
                        tdee: userFitnessData.goal?.tdee || 0,
                        calorieDeficit: userFitnessData.goal?.calorieDeficit || 0,
                        calorieGoal: userFitnessData.goal?.calorieGoal || 0,
                        nutrients: {
                            protein: userFitnessData.goal?.nutrients?.protein || 0,
                            fat: userFitnessData.goal?.nutrients?.fat || 0,
                            carbs: userFitnessData.goal?.nutrients?.carbs || 0,
                            sugar: userFitnessData.goal?.nutrients?.sugar || 0,
                        }
                    },
                }
            }).then(() => {
                return {
                    success: true,
                    message: "Goal saved successfully!"
                }
            }).catch((error) => {
                console.log("Error while Creating User Profile & Goal: " + error)

                return {
                    success: false,
                    message: "Goal failed to save!"
                }
            })

            if (response.success) {
                const cookie = await cookies();
                cookie.delete("userFitnessData");

                return { message: response.message }

            } else {
                throw new Error(`Failed to create Goal`);
            }
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item`);
    }
}

export const fetchExistedUserGoal = async (userEmail: string) => {
    if (!userEmail)
        throw new Error(`User not found`);

    return await prisma.userFitness.findFirst({
        where: {
            userEmail: userEmail,
        },
        select: {
            id: true,
            profile: true,
            goal: true,
            userEmail: true,
        }
    }).catch((error) => {
        console.error("Error fetching existed user goal: ", error);
        return null;
    });
}