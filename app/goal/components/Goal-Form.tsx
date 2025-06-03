"use client"

import { setLocalStorageData } from "@/app/client/localstorage.action"
import ResponsiveHint from "@/app/components/ResponsiveHint"
import { fetchGoal, saveGoal, type GoalFormValues } from "@/app/goal/server/goal.action"
import useUserGoal from "@/app/hooks/userUserGoal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, HelpCircle, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Define the schema for form validation
const formSchema = z.object({
    weight: z.coerce.number().positive({ message: "Weight must be a positive number" }).min(10, "Should be at least 10"),
    weightUnit: z.enum(["kg", "lbs"]),
    heightCm: z.coerce.number().positive({ message: "Height must be a positive number" }).min(10, "Should be at least 10").optional(),
    heightFeet: z.coerce.number().nonnegative().min(1, "Should be at least 1").optional(),
    heightInches: z.coerce.number().nonnegative().optional(),
    heightUnit: z.enum(["cm", "ft"]),
    age: z.coerce
        .number()
        .positive()
        .int()
        .min(18, { message: "You must be at least 18 years old" })
        .max(100, { message: "Age must be 100 or less" }),
    gender: z.enum(["male", "female"]),
    activityLevel: z.enum(["1.2", "1.375", "1.55", "1.725", "1.9"]),
    weeklyWeightLoss: z.enum(["0.25", "0.5", "1", ""]).optional(),
    calorieDeficitPreference: z.enum(["mild", "moderate", "aggressive"]).optional(),
    privacyConsent: z.boolean().refine(val => val === true),
})

type FormValues = z.infer<typeof formSchema>

type UserGoal = {
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
} | null

export type UserFitnessType = {
    profile: GoalFormValues,
    goal: UserGoal
} | null

export function GoalForm({ isGoalForm }: { isGoalForm: boolean }) {
    const { existedUserGoal } = useUserGoal();
    const router = useRouter();
    const [calculationResults, setCalculationResults] = useState<UserGoal>(existedUserGoal?.id ? existedUserGoal?.goal : null)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            weight: existedUserGoal?.profile.weight || 0,
            heightCm: existedUserGoal?.profile.heightCm || 0,
            heightFeet: existedUserGoal?.profile.heightFeet || 0,
            heightInches: existedUserGoal?.profile.heightInches || 0,
            age: existedUserGoal?.profile.age || 0,
            weightUnit: existedUserGoal?.profile.weightUnit as "kg" | "lbs" || "kg",
            heightUnit: existedUserGoal?.profile.heightUnit as "cm" | "ft" || "cm",
            gender: existedUserGoal?.profile.gender as "male" | "female" || "male",
            activityLevel: existedUserGoal?.profile.activityLevel as "1.2" | "1.375" | "1.55" | "1.725" | "1.9" || "1.2",
            weeklyWeightLoss: existedUserGoal?.profile.weeklyWeightLoss as "0.25" | "0.5" | "1" | "" || undefined,
            calorieDeficitPreference: existedUserGoal?.profile.calorieDeficitPreference as "mild" | "moderate" | "aggressive" | "" || undefined,
            privacyConsent: false,
        },
        mode: 'onChange',
    });

    const bottomRef = useRef<HTMLDivElement | null>(null)

    const [userFitnessData, setUserFitnessData] = useState<UserFitnessType>(null)

    useEffect(() => {
        if (calculationResults && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [calculationResults])

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        try {
            const result = await fetchGoal(values as GoalFormValues)
            if (result.success && result.data) {
                setCalculationResults(result.data);

                setUserFitnessData({
                    profile: {
                        ...values as GoalFormValues
                    },
                    goal: {
                        ...result.data
                    }
                });
                setLocalStorageData("user-data", userFitnessData);

            }
            else if (result.error) {
                toast.error(result.error);
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleSaveGoal() {
        setIsSaving(true)
        try {
            if (!calculationResults) return null;
            toast.promise(
                saveGoal(userFitnessData),
                {
                    loading: 'Saving Goal...',
                    success: (data) => {
                        router.push("/tracker");
                        return `${data?.message}`;
                    },
                    error: (error) => {
                        return error.message || "Something went wrong";
                    },
                }
            );
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {/* Body Metrics */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-dietBlue-700">Body Metrics</h2>

                                    {/* Weight */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Weight</FormLabel>
                                                    <div className="flex gap-2">
                                                        <FormControl>
                                                            <Input type="number" placeholder="Weight" {...field} min={10} />
                                                        </FormControl>
                                                        <FormField
                                                            control={form.control}
                                                            name="weightUnit"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="w-20">
                                                                                <SelectValue placeholder="Unit" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="kg">kg</SelectItem>
                                                                            <SelectItem value="lbs">lbs</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Height */}
                                        <FormField
                                            control={form.control}
                                            name="heightUnit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Height</FormLabel>
                                                    <Tabs
                                                        defaultValue="cm"
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            field.onChange(value as "cm" | "ft")
                                                        }}
                                                        className="w-full"
                                                    >
                                                        <TabsList className="grid w-full grid-cols-2">
                                                            <TabsTrigger value="cm">Centimeters</TabsTrigger>
                                                            <TabsTrigger value="ft">Feet & Inches</TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="cm" className="mt-2">
                                                            <FormField
                                                                control={form.control}
                                                                name="heightCm"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input type="number" placeholder="Height in cm" {...field} min={10} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TabsContent>
                                                        <TabsContent value="ft" className="mt-2">
                                                            <div className="flex gap-2">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="heightFeet"
                                                                    render={({ field }) => (
                                                                        <FormItem className="flex-1">
                                                                            <FormControl>
                                                                                <Input type="number" placeholder="Feet" {...field} min={1} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name="heightInches"
                                                                    render={({ field }) => (
                                                                        <FormItem className="flex-1">
                                                                            <FormControl>
                                                                                <Input type="number" placeholder="Inches" {...field} min={0} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Age */}
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Age</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Age" {...field} min={18} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Gender */}
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <FormDescription>This is used for BMR calculation purposes only.</FormDescription>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex space-x-4"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="male" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Male</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="female" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Female</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Activity Level */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-dietBlue-700">Activity Level</h2>

                                    {/* Activity Level */}
                                    <FormField
                                        control={form.control}
                                        name="activityLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <div className="flex items-center gap-2">
                                                        Activity Level
                                                        <ResponsiveHint
                                                            icon={<HelpCircle className="h-4 w-4" />}
                                                            label="Activity level info"
                                                            content={
                                                                <>
                                                                    Choose the option that best describes
                                                                    <br />
                                                                    your typical weekly activity level.
                                                                </>
                                                            }
                                                        />
                                                    </div>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select activity level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1.2">Sedentary (little to no exercise)</SelectItem>
                                                        <SelectItem value="1.375">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                                                        <SelectItem value="1.55">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                                                        <SelectItem value="1.725">Very Active (hard exercise 6-7 days/week)</SelectItem>
                                                        <SelectItem value="1.9">Extra Active (very hard exercise & physical job)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Weight Loss Goals */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-dietBlue-700">Weight Loss Goals</h2>

                                    {/* Weekly Weight Loss */}
                                    <FormField
                                        name="weeklyWeightLoss"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <div className="flex items-center gap-2">
                                                        Desired Weekly Weight Loss
                                                        <ResponsiveHint
                                                            icon={<HelpCircle className="h-4 w-4" />}
                                                            label="Weekly weight loss info"
                                                            content={
                                                                <>
                                                                    Recommended weight loss is 0.5-1 kg
                                                                    <br />per week for sustainable results.
                                                                </>
                                                            }
                                                        />

                                                        {form.getValues("weeklyWeightLoss") && <button
                                                            type="button"
                                                            onClick={() => form.resetField("weeklyWeightLoss", { defaultValue: "" })}
                                                            className="text-sm text-muted-foreground italic underline underline-offset-2 hover:text-primary"
                                                        >
                                                            clear
                                                        </button>}
                                                    </div>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select weekly weight loss goal" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0.25">0.25 kg (0.55 lbs) per week (gentle)</SelectItem>
                                                        <SelectItem value="0.5">0.5 kg (1.1 lbs) per week (moderate)</SelectItem>
                                                        <SelectItem value="1">1 kg (2.2 lbs) per week (aggressive)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Optional: Choose your desired weekly weight loss rate. If you selected this, no need to choose below preference.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Calorie Deficit Preference */}
                                    <FormField
                                        control={form.control}
                                        name="calorieDeficitPreference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <div className="flex items-center gap-2">
                                                        Calorie Deficit Preference
                                                        <ResponsiveHint
                                                            icon={<HelpCircle className="h-4 w-4" />}
                                                            label="Calorie deficit info"
                                                            content={
                                                                <>
                                                                    Mild: 10-15% of TDEE (slower but more sustainable)
                                                                    <br />
                                                                    Moderate: 15-20% of TDEE (balanced approach)
                                                                    <br />
                                                                    Aggressive: 20-25% of TDEE (faster but more challenging)
                                                                </>
                                                            }
                                                        />
                                                    </div>
                                                </FormLabel>
                                                <FormControl aria-disabled="true">
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                        disabled={form.getValues("weeklyWeightLoss") ? true : false}
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="mild" />
                                                            </FormControl>
                                                            <FormLabel className={`font-normal ${form.getValues("weeklyWeightLoss") ? "text-muted-foreground" : ""}`}>Mild (10-15% deficit)</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="moderate" />
                                                            </FormControl>
                                                            <FormLabel className={`font-normal ${form.getValues("weeklyWeightLoss") ? "text-muted-foreground" : ""}`}>Moderate (15-20% deficit)</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="aggressive" />
                                                            </FormControl>
                                                            <FormLabel className={`font-normal ${form.getValues("weeklyWeightLoss") ? "text-muted-foreground" : ""}`}>Aggressive (20-25% deficit)</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormDescription>
                                                    Optional: Choose your preferred deficit intensity. If you selected a weekly weight loss goal
                                                    above, this will be calculated automatically.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <FormField
                        control={form.control}
                        name="privacyConsent"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        I consent to DietTracker collecting and processing my personal data
                                    </FormLabel>
                                    <FormDescription className="leading-5">
                                        By checking this box, you acknowledge that you're voluntarily sharing your physical data
                                        (height, weight, age, and gender) with DietTracker. We use this information solely to
                                        provide personalized nutrition recommendations and track your progress. Your data is
                                        protected and never shared with third parties.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center gap-8">
                        {isGoalForm
                            ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="dietOutline"
                                        size="lg"
                                        onClick={() => router.push("/tracker")}
                                        className="p-4" 
                                    >
                                        Back to Tracker
                                    </Button>
                                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 p-4" disabled={isSubmitting}>
                                        {isSubmitting ? "Calculating..." : "Calculate Goal"}
                                    </Button>
                                </>
                            )
                            : <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                                {isSubmitting ? "Calculating..." : "Calculate Calorie"}
                            </Button>}
                    </div>
                </form>
            </Form>

            {calculationResults && (
                <Card className="border-2 border-secondary">
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-dietBlue-700">Your Personalized Results</h2>

                            <Tabs defaultValue="calories" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="calories">Daily Calorie Goal</TabsTrigger>
                                    <TabsTrigger value="nutrients">Daily Nutrient Goal</TabsTrigger>
                                </TabsList>

                                <TabsContent value="calories" className="mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-gray-700">Basal Metabolic Rate (BMR)</h3>
                                            <p className="text-3xl font-bold text-dietBlue-700">{calculationResults.bmr} calories</p>
                                            <p className="text-sm text-gray-500 mt-1">The calories your body needs at complete rest</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-gray-700">Total Daily Energy Expenditure (TDEE)</h3>
                                            <p className="text-3xl font-bold text-dietBlue-700">{calculationResults.tdee} calories</p>
                                            <p className="text-sm text-gray-500 mt-1">Your maintenance calories with activity level</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="flex justify-start items-center text-lg font-medium text-gray-700 gap-2">
                                                Daily Calorie Deficit
                                                <ResponsiveHint
                                                    icon={<HelpCircle className="h-4 w-4" />}
                                                    label="System Default Calorie Deficit"
                                                    content={
                                                        <>
                                                            System default calorie deficit will be recommended if you don't select either <b> Desired Weekly Weight Loss</b> or <b>Calorie Deficit Preference</b>.
                                                            For most users, this ensures a safe and effective calorie reduction tailored to your profile.
                                                            For more control, choose one of the options above.
                                                        </>
                                                    }
                                                />

                                            </h3>
                                            <p className="text-3xl font-bold text-secondary">{calculationResults.calorieDeficit} calories</p>
                                            {form.getValues("weeklyWeightLoss") && form.getValues("calorieDeficitPreference")
                                                ? <p className="text-sm text-gray-500 mt-1">Your recommended daily calorie reduction</p>
                                                : <p className="text-sm text-gray-500 mt-1"><span className="font-bold">System default</span> daily calorie reduction</p>
                                            }
                                        </div>

                                        <div className="bg-primary p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-white">Your Daily Calorie Goal</h3>
                                            <p className="text-3xl font-bold text-white">{calculationResults.calorieGoal} calories</p>
                                            <p className="text-sm text-gray-200 mt-1">Aim for this daily calorie intake to reach your goal</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
                                        <h4 className="font-semibold text-blue-800 mb-2">🤔 What This Means</h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• Protein To achieve your weight loss goal, aim to consume approximately <strong>{calculationResults.calorieGoal} calories</strong> per day.</li>
                                            <li>• Remember that sustainable weight loss is typically <strong>0.5 - 1kg</strong> per week.</li>
                                            <li>• Track your food intake and exercise regularly to maintain this calorie deficit.</li>
                                        </ul>
                                    </div>
                                </TabsContent>

                                <TabsContent value="nutrients" className="mt-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Protein - Highlighted */}
                                            <div className="bg-secondary/10 border-2 border-secondary p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Target className="h-5 w-5 text-secondary" />
                                                    <h3 className="text-lg font-bold text-secondary">Protein</h3>
                                                </div>
                                                <p className="text-3xl font-bold text-secondary">{calculationResults.nutrients.protein} g</p>
                                                <p className="text-sm text-gray-600 mt-1">30% of total calories (4 kcal/g)</p>
                                            </div>

                                            {/* Fat */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-700">Fat</h3>
                                                <p className="text-3xl font-bold text-primary">{calculationResults.nutrients.fat} g</p>
                                                <p className="text-sm text-gray-500 mt-1">25% of total calories (9 kcal/g)</p>
                                            </div>

                                            {/* Carbs */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-700">Carbohydrates</h3>
                                                <p className="text-3xl font-bold text-primary">{calculationResults.nutrients.carbs} g</p>
                                                <p className="text-sm text-gray-500 mt-1">Remaining calories (4 kcal/g)</p>
                                            </div>

                                            {/* Sugar */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-700">Sugar</h3>
                                                <p className="text-3xl font-bold text-primary">≤ {calculationResults.nutrients.sugar} g</p>
                                                <p className="text-sm text-gray-500 mt-1">Max 10% of calories or 50g limit</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
                                            <h4 className="font-semibold text-blue-800 mb-2">💡 Nutrition Tips</h4>
                                            <ul className="text-sm text-blue-700 space-y-1">
                                                <li>• These Daily Macronutrient Targets are based on your <strong>{calculationResults.calorieGoal}</strong> calorie goal</li>
                                                <li>
                                                    • <strong>Protein</strong> is highlighted as it's crucial for muscle maintenance during weight
                                                    loss
                                                </li>
                                                <li>• Focus on whole foods and minimize processed sugar intake</li>
                                                <li>• These targets are guidelines - listen to your body and adjust as needed</li>
                                            </ul>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-center mt-6">
                                {isGoalForm
                                    ? <Button className="bg-secondary hover:bg-secondary/90" onClick={handleSaveGoal} disabled={userFitnessData ? false : true}>
                                        Save & Continue Tracking
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    : <Button className="bg-secondary hover:bg-secondary/90" onClick={() => { router.push("/tracker") }}>
                                        Start Tracking
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>}
                            </div>

                            {/* Reference div placed at the end of scrollable content */}
                            <div ref={bottomRef} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
