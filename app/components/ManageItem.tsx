"use client"
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AllDietType } from "@/types/Diet";
import { ChangeEvent, useState } from "react";
// import { useDiet } from "../context/DietProvider";
type itemFixedNutrientValue = {
    food_item: string;
    current_weight: number;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    sugar: number;
    amount_per: number;
} | undefined

export default function ManageItem({ isNewItem, itemFixedNutrientValue }: { isNewItem: boolean, itemFixedNutrientValue?: itemFixedNutrientValue }) {
    const [newItem, setNewItem] = useState({
        food_item: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amount_per: 100,
    });

    const [editItem, setEditItem] = useState({
        food_item: itemFixedNutrientValue?.food_item,
        calories: itemFixedNutrientValue?.calories,
        protein: itemFixedNutrientValue?.protein,
        carbs: itemFixedNutrientValue?.carbs,
        fat: itemFixedNutrientValue?.fat,
        sugar: itemFixedNutrientValue?.sugar,
        amount_per: itemFixedNutrientValue?.amount_per,
    });


    const handleNewItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setNewItem({ ...newItem, [event.target.id]: event.target.value });
    };

    const handleEditItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setEditItem({ ...editItem, [event.target.id]: event.target.value });
    };

    return (
        <>
            {isNewItem ?
                <>
                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="food_item" className="text-right">
                                Food Name
                            </Label>
                            <Input id="food_item" value={newItem.food_item} className="col-span-3" type="text" onChange={handleNewItem} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="w-full">
                            <Label htmlFor="calories" className="text-right">
                                Calories (g)
                            </Label>
                            <Input id="calories" value={newItem.calories} className="col-span-3" type="number" onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="protein" className="text-right">
                                Protein (g)
                            </Label>
                            <Input id="protein" value={newItem.protein} className="col-span-3" type="number" onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="carbs" className="text-right">
                                Carbs (g)
                            </Label>
                            <Input id="carbs" value={newItem.carbs} className="col-span-3" type="number" onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="fat" className="text-right">
                                Fat (g)
                            </Label>
                            <Input id="fat" value={newItem.fat} className="col-span-3" type="number" onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="sugar" className="text-right">
                                Sugar (g)
                            </Label>
                            <Input id="sugar" value={newItem.sugar} className="col-span-3" type="number" onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="amount_per" className="text-right">
                                Amount Per (g)
                            </Label>
                            <Input id="amount_per" value={newItem.amount_per} className="col-span-3" type="number" onChange={handleNewItem} />
                        </div>
                    </div>
                </>
                : itemFixedNutrientValue &&
                <>
                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="food_item" className="text-right">
                                Food Name
                            </Label>
                            <Input id="food_item" value={editItem.food_item} className="col-span-3" type="text" onChange={handleEditItem} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="w-full">
                            <Label htmlFor="calories" className="text-right">
                                Calories (g)
                            </Label>
                            <Input id="calories" value={editItem.calories} className="col-span-3" type="number" onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="protein" className="text-right">
                                Protein (g)
                            </Label>
                            <Input id="protein" value={editItem.protein} className="col-span-3" type="number" onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="carbs" className="text-right">
                                Carbs (g)
                            </Label>
                            <Input id="carbs" value={editItem.carbs} className="col-span-3" type="number" onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="fat" className="text-right">
                                Fat (g)
                            </Label>
                            <Input id="fat" value={editItem.fat} className="col-span-3" type="number" onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="sugar" className="text-right">
                                Sugar (g)
                            </Label>
                            <Input id="sugar" value={editItem.sugar} className="col-span-3" type="number" onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="amount_per" className="text-right">
                                Amount Per (g)
                            </Label>
                            <Input id="amount_per" value={editItem.amount_per} className="col-span-3" type="number" onChange={handleEditItem} />
                        </div>
                    </div>
                </>}

            <DialogFooter>
                {isNewItem
                    ? <Button type="submit">Create Item</Button>
                    : <div className="flex justify-center items-center gap-2">
                        <Button type="submit">Delete Item</Button>
                        <Button type="submit">Update Item</Button>
                    </div>
                }
            </DialogFooter>
        </>
    )
}
