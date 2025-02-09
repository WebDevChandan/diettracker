"use client"
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useDialog from "@/hooks/useDialog";
import { AllCategory } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { toast } from "sonner";
import { z } from 'zod';
import { useDiet } from "../hooks/useDiet";
import { useManageItemAction } from "../hooks/useManageItemAction";
import { addFoodItem, deleteFoodItem, updateFoodItem } from "../server/diet.action";

const itemSchema = z.object({
    name: z.string().min(3, { message: 'Invalid Food Name' }).max(20, { message: 'Name length exceeded' }),
    calories: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(500, { message: "Min: 0g Max: 500g" }),
    currentWeight: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(500, { message: "Min: 0g Max: 500g" }),
    protein: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(500, { message: "Min: 0g Max: 500g" }),
    carbs: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(500, { message: "Min: 0g Max: 500g" }),
    fat: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(500, { message: "Min: 0g Max: 500g" }),
    sugar: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(500, { message: "Min: 0g Max: 500g" }),
    amountPer: z.number().min(1, { message: "Min: 1g Max: 2kg" }).max(2000, { message: "Min: 1g Max: 2kg" }),
    category: z.string().min(1, { message: "Select at least one category" }),
})

export default function ManageItem({ isNewItem, currentCategory }: { isNewItem: boolean, currentCategory: AllCategory }) {
    const { diet, setDiet } = useDiet();
    const { open, setOpen } = useDialog();
    const { foodItem, setFoodItem } = useManageItemAction();

    const [initialFoodItemstate, setInitialFoodItemstate] = useState(foodItem);

    const [invalidItemError, setInvalidItemError] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        sugar: '',
        amountPer: '',
        category: '',
        currentWeight: '',
    });

    const handleFoodItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value === '' ? 0 : parseFloat(event.target.value);
        setFoodItem({ ...foodItem, [event.target.id]: event.target.id !== 'name' ? value : event.target.value });
    };

    const handleFoodItemCategory = (value: string) => {
        if (!value) return

        setFoodItem({ ...foodItem, category: { name: value as AllCategory } });
    }

    const handleItemValidation = () => {
        setInvalidItemError({
            name: '',
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            sugar: '',
            amountPer: '',
            category: '',
            currentWeight: '',
        });

        const validation = itemSchema.safeParse({
            name: foodItem.name,
            calories: foodItem.calories,
            currentWeight: foodItem.currentWeight,
            protein: foodItem.protein,
            carbs: foodItem.carbs,
            fat: foodItem.fat,
            sugar: foodItem.sugar,
            amountPer: foodItem.amountPer,
            category: foodItem.category.name,
        })

        if (!validation.success) {
            validation.error.issues.map(issue => {
                setInvalidItemError((prevErr) => {
                    return { ...prevErr, [issue.path[0]]: issue.message };
                });
            })
        }

        const isDuplicateItem = diet.some(item => {
            if (isNewItem)
                return item.name.toLocaleLowerCase() === foodItem.name.toLocaleLowerCase() && item.category.name === foodItem.category.name;
            else
                return foodItem.name.toLocaleLowerCase() !== initialFoodItemstate.name.toLocaleLowerCase() && item.name.toLocaleLowerCase() === foodItem.name.toLocaleLowerCase();
        });

        return {
            isValidItem: validation.success,
            isDuplicateItem: isDuplicateItem,
        };
    }

    const handleAddFoodItem = async () => {
        const { isValidItem, isDuplicateItem } = handleItemValidation() as { isValidItem: boolean, isDuplicateItem: boolean };

        if (isValidItem && isDuplicateItem)
            return toast.info(`Duplicate item found in ${foodItem.category.name}`);

        if (isValidItem && !isDuplicateItem) {

            toast.promise(
                addFoodItem(foodItem),
                {
                    loading: 'Item Adding...',
                    success: (data) => {
                        if (data.message) {
                            setDiet([
                                ...diet, {
                                    ...foodItem,
                                    id: data.newItemId
                                }
                            ]);

                            setFoodItem({
                                name: '',
                                calories: 0,
                                currentWeight: 0,
                                protein: 0,
                                carbs: 0,
                                fat: 0,
                                sugar: 0,
                                amountPer: 100,
                                category: {
                                    name: "" as AllCategory,
                                },
                            });

                            setOpen(false);

                            return `${data.message}`;
                        }

                        return "Unexpected response";
                    },
                    error: (error) => {
                        return error.message || "Something went wrong";
                    },
                }
            );
        }
    }

    const handleUpdateFoodItem = async () => {
        const { isValidItem, isDuplicateItem } = handleItemValidation() as { isValidItem: boolean, isDuplicateItem: boolean };

        if (isValidItem && isDuplicateItem)
            return toast.info(`Duplicate item found in ${foodItem.category.name}`);

        if (isValidItem && !isDuplicateItem) {
            toast.promise(
                updateFoodItem(foodItem),
                {
                    loading: 'Item Updating...',
                    success: (data) => {
                        if (data.message) {
                            setDiet((prevDiet) => {
                                return prevDiet.map(item => {
                                    if (item.id === initialFoodItemstate.id) {
                                        return foodItem;
                                    }
                                    return item;
                                })
                            });

                            setOpen(false);

                            return `${data.message}`;
                        }

                        return "Unexpected response";
                    },
                    error: (error) => {
                        return error.message || "Something went wrong";
                    },
                }
            );
        }
    }

    const handleDeleteFoodItem = async () => {
        if (confirm(`Are you sure you want to delete "${foodItem.name}"?`))
            toast.promise(
                deleteFoodItem(foodItem),
                {
                    loading: 'Item Deleting...',
                    success: (data) => {
                        if (data.message) {
                            setDiet((prevDiet) => {
                                return prevDiet.filter(item => {
                                    return item.id !== initialFoodItemstate.id;
                                });
                            });

                            setOpen(false);

                            return `${data.message}`;
                        }

                        return "Unexpected response";
                    },
                    error: (error) => {
                        return error.message || "Something went wrong";
                    },
                }
            );
    }

    return (
        <>
            <div className="grid gap-4">
                <div className="w-full">
                    <Label htmlFor="name" className="text-right">Food Name*</Label>
                    <Label htmlFor="name" className="text-red-500 text-xs ml-1">{invalidItemError.name}</Label>
                    <Input id="name" value={foodItem.name} className="col-span-3" type="text" onChange={handleFoodItem} minLength={3} maxLength={20} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
                <div className="w-full">
                    <Label htmlFor="calories" className="text-right">Calories (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="calories" className="text-red-500 text-xs ml-1 block">{invalidItemError.calories}</Label>
                    <Input id="calories" value={foodItem.calories} className="col-span-3" type="number" min={0} max={500} onChange={handleFoodItem} />
                </div>
                <div className="w-full">
                    <Label htmlFor="protein" className="text-right">Protein (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="protein" className="text-red-500 text-xs ml-1 block">{invalidItemError.protein}</Label>
                    <Input id="protein" value={foodItem.protein} className="col-span-3" type="number" min={0} max={500} onChange={handleFoodItem} />
                </div>
                <div className="w-full">
                    <Label htmlFor="carbs" className="text-right">Carbs (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="carbs" className="text-red-500 text-xs ml-1 block">{invalidItemError.carbs}</Label>
                    <Input id="carbs" value={foodItem.carbs} className="col-span-3" type="number" min={0} max={500} onChange={handleFoodItem} />
                </div>
                <div className="w-full">
                    <Label htmlFor="fat" className="text-right">Fat (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="fat" className="text-red-500 text-xs ml-1 block">{invalidItemError.fat}</Label>
                    <Input id="fat" value={foodItem.fat} className="col-span-3" type="number" min={0} max={500} onChange={handleFoodItem} />
                </div>
                <div className="w-full">
                    <Label htmlFor="sugar" className="text-right">Sugar (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="sugar" className="text-red-500 text-xs ml-1 block">{invalidItemError.sugar}</Label>
                    <Input id="sugar" value={foodItem.sugar} className="col-span-3" type="number" min={0} max={500} onChange={handleFoodItem} />
                </div>
                <div className="w-full">
                    <Label htmlFor="amountPer" className="text-right">Amount Per* (g)</Label>
                    <Label htmlFor="amountPer" className="text-red-500 text-xs ml-1 block">{invalidItemError.amountPer}</Label>
                    <Input id="amountPer" value={foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} className="col-span-3" type="number" min={0} max={2000} onChange={handleFoodItem} />
                </div>
                {<div className="w-full">
                    <Label htmlFor="currentWeight" className="text-right inline-flex gap-2 items-center">
                        Add Weight (g)
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <MdInfoOutline cursor="pointer" size={16} />

                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add Food Intake Weight</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </Label>
                    <Label htmlFor="currentWeight" className="text-red-500 text-xs ml-1 block">{invalidItemError.currentWeight}</Label>
                    <Input id="currentWeight" value={foodItem.currentWeight} className="col-span-3" type="number" min={0} max={500} onChange={handleFoodItem} />
                </div>}
            </div>

            <div className="grid gap-4">
                <div className="w-full">
                    <Label htmlFor="category" className="text-right">Category*</Label>
                    <Label htmlFor="category" className="text-red-500 text-xs ml-1">{invalidItemError.category}</Label>
                    <Select onValueChange={handleFoodItemCategory} defaultValue={currentCategory}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                                <SelectItem value="snacks">Snacks</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter>
                {isNewItem
                    ? <Button type="submit" onClick={handleAddFoodItem}>Add Item</Button>
                    : <div className="flex justify-center items-center gap-2">
                        <Button type="submit" onClick={handleDeleteFoodItem}>Delete Item</Button>
                        <Button type="submit" onClick={handleUpdateFoodItem}>Update Item</Button>
                    </div>
                }
            </DialogFooter>
        </>
    )
}
