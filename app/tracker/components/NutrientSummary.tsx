import useDialog from '@/app/hooks/useDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDiet } from '../hook/useDiet';
import ResponsiveHint from '@/app/components/ResponsiveHint';
import useUserGoal from '@/app/hooks/userUserGoal';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Goal, InfoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';


export default function NutrientSummary() {
    const { totalConsumed, subTotalConsumed } = useDiet();
    const { isTotalDialog, setIsTotalDialog } = useDialog();
    const { existedUserGoal } = useUserGoal();
    const router = useRouter();

    const { dailyNutrientData } = useMemo(() => {
        if (!existedUserGoal) return { dailyNutrientData: [] };

        const dailyNutrientData = [
            {
                nutrient: "Calories",
                consumed: `${totalConsumed.calories} kcal`,
                goal: `${existedUserGoal.goal.calorieGoal} kcal`,
                remaining: `${existedUserGoal.goal.calorieGoal - totalConsumed.calories} kcal`,
            },
            {
                nutrient: "Protein",
                consumed: `${totalConsumed.protein} g`,
                goal: `${existedUserGoal.goal.nutrients.protein} g`,
                remaining: `${existedUserGoal.goal.nutrients.protein - totalConsumed.protein} g`,
            },
            {
                nutrient: "Carbs",
                consumed: `${totalConsumed.carbs} g`,
                goal: `${existedUserGoal.goal.nutrients.carbs} g`,
                remaining: `${existedUserGoal.goal.nutrients.carbs - totalConsumed.carbs} g`,
            },
            {
                nutrient: "Fat",
                consumed: `${totalConsumed.fat} g`,
                goal: `${existedUserGoal.goal.nutrients.fat} g`,
                remaining: `${existedUserGoal.goal.nutrients.fat - totalConsumed.fat} g`,
            },
            {
                nutrient: "Sugar",
                consumed: `${totalConsumed.sugar} g`,
                goal: `<${existedUserGoal.goal.nutrients.sugar} g`,
                remaining: `${existedUserGoal.goal.nutrients.sugar - totalConsumed.sugar} g`,
            },
        ]

        return { dailyNutrientData };
    }, [totalConsumed, subTotalConsumed]);

    const { categoryNutrientData } = useMemo(() => {
        if (!subTotalConsumed) return { categoryNutrientData: [] };

        const categoryNutrientData = [
            {
                category: "Breakfast",
                calories: `${subTotalConsumed.breakfast.calories} kcal`,
                protein: `${subTotalConsumed.breakfast.protein} g`,
                carbs: `${subTotalConsumed.breakfast.carbs} g`,
                fat: `${subTotalConsumed.breakfast.fat} g`,
                sugar: `${subTotalConsumed.breakfast.sugar} g`,
                isTotal: false,
            },
            {
                category: "Lunch",
                calories: `${subTotalConsumed.lunch.calories} kcal`,
                protein: `${subTotalConsumed.lunch.protein} g`,
                carbs: `${subTotalConsumed.lunch.carbs} g`,
                fat: `${subTotalConsumed.lunch.fat} g`,
                sugar: `${subTotalConsumed.lunch.sugar} g`,
                isTotal: false,
            },
            {
                category: "Dinner",
                calories: `${subTotalConsumed.dinner.calories} kcal`,
                protein: `${subTotalConsumed.dinner.protein} g`,
                carbs: `${subTotalConsumed.dinner.carbs} g`,
                fat: `${subTotalConsumed.dinner.fat} g`,
                sugar: `${subTotalConsumed.dinner.sugar} g`,
                isTotal: false,
            },
            {
                category: "Snacks",
                calories: `${subTotalConsumed.snacks.calories} kcal`,
                protein: `${subTotalConsumed.snacks.protein} g`,
                carbs: `${subTotalConsumed.snacks.carbs} g`,
                fat: `${subTotalConsumed.snacks.fat} g`,
                sugar: `${subTotalConsumed.snacks.sugar} g`,
                isTotal: false,
            },
            {
                category: "Other",
                calories: `${subTotalConsumed.other.calories} kcal`,
                protein: `${subTotalConsumed.other.protein} g`,
                carbs: `${subTotalConsumed.other.carbs} g`,
                fat: `${subTotalConsumed.other.fat} g`,
                sugar: `${subTotalConsumed.other.sugar} g`,
                isTotal: false,
            },
            {
                category: "Daily Total",
                calories: `${totalConsumed.calories} kcal`,
                protein: `${totalConsumed.protein} g`,
                carbs: `${totalConsumed.carbs} g`,
                fat: `${totalConsumed.fat} g`,
                sugar: `${totalConsumed.sugar} g`,
                isTotal: true,
            },
        ];

        return { categoryNutrientData };
    }, [totalConsumed, subTotalConsumed]);

    return (
        <Dialog open={isTotalDialog} onOpenChange={setIsTotalDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">Daily Nutrition Summary</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="daily" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="daily">Overview</TabsTrigger>
                        <TabsTrigger value="category">By Category</TabsTrigger>
                    </TabsList>

                    <TabsContent value="daily" className="mt-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold text-primary mb-4">Consumed vs Goals</h3>
                                {existedUserGoal
                                    ? <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="font-semibold">Nutrient</TableHead>
                                                    <TableHead className="font-semibold">Today</TableHead>
                                                    <TableHead className="font-semibold">Goal</TableHead>
                                                    <TableHead className="font-semibold flex justify-start items-center gap-2">
                                                        Balance <ResponsiveHint
                                                            icon={<InfoIcon className="h-4 w-4" />}
                                                            label="System Default Calorie Deficit"
                                                            content={
                                                                <>
                                                                    As you're in calorie deficit,
                                                                    <b className='text-green-600'> Green</b> shows how much you can consume to stay within your goal.
                                                                    <br />If you're over, <b className='text-red-600'>Red</b>  shows how much you need to cut back.
                                                                </>
                                                            }
                                                        />
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {dailyNutrientData.map((row, index) => {
                                                    const remaining = parseFloat(row.remaining.split(" ")[0]);
                                                    const remainingUnit = row.remaining.split(" ")[1];
                                                    const isOver = remaining < 0;

                                                    return (
                                                        <TableRow key={index} className={index === 0 ? "bg-gray-50" : ""}>
                                                            <TableCell className="font-medium">{row.nutrient}</TableCell>
                                                            <TableCell>{row.consumed}</TableCell>
                                                            <TableCell>{row.goal}</TableCell>
                                                            <TableCell
                                                                className={`font-medium ${isOver ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                                                                    }`}
                                                            >
                                                                {
                                                                    isOver ? `(${Math.abs(remaining)}) ${remainingUnit}` : `${remaining} ${remainingUnit}`
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    : (
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <div className="mb-4">
                                                <Button variant="default" className="px-6 py-2 text-base rounded-lg shadow" onClick={() => router.push('/goal')}>
                                                    <Goal className="h-6 w-6" />Set Goal
                                                </Button>
                                            </div>
                                            <p className="mb-1 text-lg font-semibold text-primary">No daily goal set</p>
                                            <p className="text-sm text-gray-500 max-w-xs text-center">
                                                Set your daily nutrition goals to enable comparison with your current consumption.
                                            </p>
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="category" className="mt-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold text-primary mb-4">Breakdown by Category</h3>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-semibold">Category</TableHead>
                                                <TableHead className="font-semibold">Calories (kcal)</TableHead>
                                                <TableHead className="font-semibold">Protein</TableHead>
                                                <TableHead className="font-semibold">Carbs</TableHead>
                                                <TableHead className="font-semibold">Fat</TableHead>
                                                <TableHead className="font-semibold">Sugar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categoryNutrientData.map((row, index) => (
                                                <TableRow key={index} className={row.isTotal ? "border-t-2 border-primary bg-gray-50" : ""}>
                                                    <TableCell className={`font-medium ${row.isTotal ? "font-bold text-primary" : ""}`}>
                                                        {row.category}
                                                    </TableCell>
                                                    <TableCell className={row.isTotal ? "font-bold text-primary" : ""}>
                                                        {row.calories}
                                                    </TableCell>
                                                    <TableCell className={row.isTotal ? "font-bold text-primary" : ""}>{row.protein}</TableCell>
                                                    <TableCell className={row.isTotal ? "font-bold text-primary" : ""}>{row.carbs}</TableCell>
                                                    <TableCell className={row.isTotal ? "font-bold text-primary" : ""}>{row.fat}</TableCell>
                                                    <TableCell className={row.isTotal ? "font-bold text-primary" : ""}>{row.sugar}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
