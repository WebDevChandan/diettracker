"use client"
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useDialog from "@/hooks/useDialog";
import { AllCategory } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { z } from 'zod';
import { useDiet } from "../hooks/useDiet";
import { addItem } from "../server/dietAction";

const itemSchema = z.object({
    name: z.string().min(3, { message: 'Invalid Name' }).max(20, { message: 'Name length exceeded' }),
    calories: z.number().min(0).max(500, { message: "Min: 0, Max: 500" }),
    currentWeight: z.number().min(0),
    protein: z.number().min(0).max(500, { message: "Min: 0, Max: 500" }),
    carbs: z.number().min(0).max(500, { message: "Min: 0, Max: 500" }),
    fat: z.number().min(0).max(500, { message: "Min: 0, Max: 500" }),
    sugar: z.number().min(0).max(500, { message: "Min: 0, Max: 500" }),
    amountPer: z.number().min(1, { message: "Min: 1, Max: 500" }),
    category: z.string().min(1, { message: "Select at least one category" }),
})

type itemFixedNutrientValue = {
    name: string;
    currentWeight: number;
    calories?: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    amountPer: number;
    category: {
        name: AllCategory;
    };
} | undefined

export default function ManageItem({ isNewItem, itemFixedNutrientValue, currentCategory }: { isNewItem: boolean, itemFixedNutrientValue?: itemFixedNutrientValue, currentCategory?: AllCategory }) {
    const { diet, setDiet } = useDiet();
    const { open, setOpen } = useDialog();

    const [newItem, setNewItem] = useState({
        name: '',
        calories: 0,
        currentWeight: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 100,
        category: {
            name: currentCategory || "" as AllCategory,
        }
    });

    const [editItem, setEditItem] = useState({
        name: itemFixedNutrientValue?.name,
        calories: itemFixedNutrientValue?.calories,
        protein: itemFixedNutrientValue?.protein,
        carbs: itemFixedNutrientValue?.carbs,
        fat: itemFixedNutrientValue?.fat,
        sugar: itemFixedNutrientValue?.sugar,
        amountPer: itemFixedNutrientValue?.amountPer,
        category: {
            name: itemFixedNutrientValue?.category.name as AllCategory
        },
    });

    const [invalidItemError, setInvalidItemError] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        sugar: '',
        amountPer: '',
        category: '',
    });

    const handleNewItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value === '' ? 0 : parseFloat(event.target.value);
        setNewItem({ ...newItem, [event.target.id]: event.target.id !== 'name' ? value : event.target.value });
    };

    const handleEditItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value === '' ? 0 : parseFloat(event.target.value);
        setEditItem({ ...editItem, [event.target.id]: event.target.id !== 'name' ? value : event.target.value });
    };

    const handleNewItemCategory = (value: string) => {
        if (!value) return

        setNewItem({ ...newItem, category: { name: value as AllCategory } });
    }

    const handleEditItemCategory = (value: string) => {
        if (!value) return

        setEditItem({ ...editItem, category: { name: value as AllCategory } });
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
        });

        const validation = itemSchema.safeParse({
            name: newItem.name,
            calories: newItem.calories,
            currentWeight: newItem.currentWeight,
            protein: newItem.protein,
            carbs: newItem.carbs,
            fat: newItem.fat,
            sugar: newItem.sugar,
            amountPer: newItem.amountPer,
            category: newItem.category.name,
        })

        if (!validation.success) {
            validation.error.issues.map(issue => {
                setInvalidItemError((prevErr) => {
                    return { ...prevErr, [issue.path[0]]: issue.message };
                });
            })
        }

        const isDuplicateItem = diet.some(item => item.name.toLocaleLowerCase() === newItem.name.toLocaleLowerCase() && item.category.name === newItem.category.name);

        return {
            isValidItem: validation.success,
            isDuplicateItem: isDuplicateItem,
        };
    }


    const handleAddNewItem = async () => {
        // Add new item to the database
        const { isValidItem, isDuplicateItem } = handleItemValidation() as { isValidItem: boolean, isDuplicateItem: boolean };

        if (isValidItem && isDuplicateItem)
            return toast.info(`Duplicate item found in ${newItem.category.name}`);

        if (isValidItem && !isDuplicateItem) {

            toast.promise(
                addItem([newItem]),
                {
                    loading: 'Item Adding...',
                    success: (data) => {
                        if (data.message) {
                            setDiet([
                                ...diet,
                                newItem,
                            ]);

                            setNewItem({
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

    return (
        <>
            {isNewItem ?
                <>
                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="name" className="text-right">Food Name*</Label>
                            <Label htmlFor="name" className="text-red-500 text-xs ml-1">{invalidItemError.name}</Label>
                            <Input id="name" value={newItem.name} className="col-span-3" type="text" onChange={handleNewItem} minLength={3} maxLength={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="w-full">
                            <Label htmlFor="calories" className="text-right">Calories (g)</Label>
                            <Label htmlFor="calories" className="text-red-500 text-xs ml-1 block">{invalidItemError.calories}</Label>
                            <Input id="calories" value={newItem.calories} className="col-span-3" type="number" min={0} max={500} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="protein" className="text-right">Protein (g)</Label>
                            <Label htmlFor="protein" className="text-red-500 text-xs ml-1 block">{invalidItemError.protein}</Label>
                            <Input id="protein" value={newItem.protein} className="col-span-3" type="number" min={0} max={500} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="carbs" className="text-right">Carbs (g)</Label>
                            <Label htmlFor="carbs" className="text-red-500 text-xs ml-1 block">{invalidItemError.carbs}</Label>
                            <Input id="carbs" value={newItem.carbs} className="col-span-3" type="number" min={0} max={500} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="fat" className="text-right">Fat (g)</Label>
                            <Label htmlFor="fat" className="text-red-500 text-xs ml-1 block">{invalidItemError.fat}</Label>
                            <Input id="fat" value={newItem.fat} className="col-span-3" type="number" min={0} max={500} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="sugar" className="text-right">Sugar (g)</Label>
                            <Label htmlFor="sugar" className="text-red-500 text-xs ml-1 block">{invalidItemError.sugar}</Label>
                            <Input id="sugar" value={newItem.sugar} className="col-span-3" type="number" min={0} max={500} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="amountPer" className="text-right">Amount Per* (g)</Label>
                            <Label htmlFor="amountPer" className="text-red-500 text-xs ml-1 block">{invalidItemError.amountPer}</Label>
                            <Input id="amountPer" value={newItem.amountPer} className="col-span-3" type="number" min={0} max={500} onChange={handleNewItem} />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="category" className="text-right">Category*</Label>
                            <Label htmlFor="category" className="text-red-500 text-xs ml-1">{invalidItemError.category}</Label>
                            <Select onValueChange={handleNewItemCategory} defaultValue={currentCategory}>
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
                </>
                : itemFixedNutrientValue &&
                <>
                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="name" className="text-right">Food Name</Label>
                            <Label htmlFor="name" className="text-red-500 text-xs ml-1 block">{invalidItemError.name}</Label>
                            <Input id="name" value={editItem.name} className="col-span-3" type="text" onChange={handleEditItem} minLength={3} maxLength={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="w-full">
                            <Label htmlFor="calories" className="text-right">Calories (g)</Label>
                            <Label htmlFor="calories" className="text-red-500 text-xs ml-1 block">{invalidItemError.calories}</Label>
                            <Input id="calories" value={editItem.calories} className="col-span-3" type="number" min={0} max={500} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="protein" className="text-right">Protein (g)</Label>
                            <Label htmlFor="protein" className="text-red-500 text-xs ml-1 block">{invalidItemError.protein}</Label>
                            <Input id="protein" value={editItem.protein} className="col-span-3" type="number" min={0} max={500} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="carbs" className="text-right">Carbs (g)</Label>
                            <Label htmlFor="carbs" className="text-red-500 text-xs ml-1 block">{invalidItemError.carbs}</Label>
                            <Input id="carbs" value={editItem.carbs} className="col-span-3" type="number" min={0} max={500} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="fat" className="text-right">Fat (g)</Label>
                            <Label htmlFor="fat" className="text-red-500 text-xs ml-1 block">{invalidItemError.fat}</Label>
                            <Input id="fat" value={editItem.fat} className="col-span-3" type="number" min={0} max={500} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="sugar" className="text-right">Sugar (g)</Label>
                            <Label htmlFor="sugar" className="text-red-500 text-xs ml-1 block">{invalidItemError.sugar}</Label>
                            <Input id="sugar" value={editItem.sugar} className="col-span-3" type="number" min={0} max={500} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="amountPer" className="text-right">Amount Per (g)</Label>
                            <Label htmlFor="amountPer" className="text-red-500 text-xs ml-1 block">{invalidItemError.amountPer}</Label>
                            <Input id="amountPer" value={editItem.amountPer} className="col-span-3" type="number" min={1} max={500} onChange={handleEditItem} />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Label htmlFor="category" className="text-red-500 text-xs ml-1 block">{invalidItemError.category}</Label>
                            <Select onValueChange={handleEditItemCategory} defaultValue={editItem.category.name}>
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
                </>}

            <DialogFooter>
                {isNewItem
                    ? <Button type="submit" onClick={handleAddNewItem}>Add Item</Button>
                    : <div className="flex justify-center items-center gap-2">
                        <Button type="submit">Delete Item</Button>
                        <Button type="submit">Update Item</Button>
                    </div>
                }
            </DialogFooter>
        </>
    )
}
