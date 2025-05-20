"use server"
import { z } from "zod"

// Define the schema for form validation
const goalFormSchema = z.object({
    weight: z.number().positive(),
    weightUnit: z.enum(["kg", "lbs"]),
    heightCm: z.number().positive().optional(),
    heightFeet: z.number().nonnegative().optional(),
    heightInches: z.number().nonnegative().optional(),
    heightUnit: z.enum(["cm", "ft"]),
    age: z.number().positive().int().min(18).max(100),
    gender: z.enum(["male", "female"]),
    activityLevel: z.enum(["1.2", "1.375", "1.55", "1.725", "1.9"]),
    weeklyWeightLoss: z.enum(["0.25", "0.5", "1"]).optional(),
    calorieDeficitPreference: z.enum(["mild", "moderate", "aggressive"]).optional(),
})

export type GoalFormValues = z.infer<typeof goalFormSchema>

type CalculatedGoal = {
    bmr: number
    tdee: number
    calorieDeficit: number
    calorieGoal: number
}

export async function fetchGoal(formData: GoalFormValues) {
    try {
        // Validate the form data
        const validatedData = goalFormSchema.parse(formData)

        // Convert weight to kg if needed
        let weightInKg = validatedData.weight
        if (validatedData.weightUnit === "lbs") {
            weightInKg = Number.parseFloat((validatedData.weight * 0.45359237).toFixed(1));
        }

        // Calculate height in cm
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
        const calorieGoal = Math.round(tdee - calorieDeficit)

        return {
            success: true,
            data: {
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                calorieDeficit: Math.round(calorieDeficit),
                calorieGoal: calorieGoal,
            },
        }
    } catch (error) {
        console.error("Error saving goal:", error)
        return {
            success: false,
            error: "Failed to save goal. Please check your inputs and try again.",
        }
    }
}


export async function saveGoal(formData: GoalFormValues, calculationResults: CalculatedGoal) {
    console.log("formData");
    console.log(formData);

    console.log("calculationResults");
    console.log(calculationResults);
}