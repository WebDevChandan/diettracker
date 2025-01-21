"use client"
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AllCategory } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { addItem } from "../server/dietAction";
import { useRouter } from "next/navigation";
import { useDiet } from "../hook/useDiet";
import useDialog from "@/hook/useDialog";

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

export default function ManageItem({ isNewItem, itemFixedNutrientValue }: { isNewItem: boolean, itemFixedNutrientValue?: itemFixedNutrientValue }) {
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
            name: "" as AllCategory,
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


    const handleNewItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (!event.target.value)
            return;

        setNewItem({ ...newItem, [event.target.id]: event.target.id !== 'name' ? parseFloat(event.target.value) : event.target.value });
    };

    const handleEditItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (!event.target.value)
            return;

        setEditItem({ ...editItem, [event.target.id]: event.target.id !== 'name' ? parseFloat(event.target.value) : event.target.value });
    };

    const handleNewItemCategory = (value: string) => {
        if (!value) return

        setNewItem({ ...newItem, category: { name: value as AllCategory } });
    }

    const handleEditItemCategory = (value: string) => {
        if (!value) return

        setEditItem({ ...editItem, category: { name: value as AllCategory } });
    }

    const handleAddNewItem = async () => {
        // Add new item to the database
        toast.promise(addItem([newItem]), {
            loading: 'Item Adding...',
            success: (data) => {
                setDiet([
                    ...diet,
                    newItem,
                ])

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
                    }
                })

                setOpen(false);

                return `${data.message}`;
            },
            error: (data) => {
                if (data.error)
                    return `${data.error}`;
                else
                    return `Something went wrong`;
            },
        })
    }

    console.log(newItem);

    return (
        <>
            {isNewItem ?
                <>
                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="name" className="text-right">
                                Food Name
                            </Label>
                            <Input id="name" value={newItem.name} className="col-span-3" type="text" onChange={handleNewItem} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="w-full">
                            <Label htmlFor="calories" className="text-right">
                                Calories (g)
                            </Label>
                            <Input id="calories" value={newItem.calories} className="col-span-3" type="number" min={0} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="protein" className="text-right">
                                Protein (g)
                            </Label>
                            <Input id="protein" value={newItem.protein} className="col-span-3" type="number" min={0} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="carbs" className="text-right">
                                Carbs (g)
                            </Label>
                            <Input id="carbs" value={newItem.carbs} className="col-span-3" type="number" min={0} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="fat" className="text-right">
                                Fat (g)
                            </Label>
                            <Input id="fat" value={newItem.fat} className="col-span-3" type="number" min={0} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="sugar" className="text-right">
                                Sugar (g)
                            </Label>
                            <Input id="sugar" value={newItem.sugar} className="col-span-3" type="number" min={0} onChange={handleNewItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="amountPer" className="text-right">
                                Amount Per (g)
                            </Label>
                            <Input id="amountPer" value={newItem.amountPer} className="col-span-3" type="number" min={0} onChange={handleNewItem} />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select onValueChange={handleNewItemCategory}>
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
                            <Label htmlFor="name" className="text-right">
                                Food Name
                            </Label>
                            <Input id="name" value={editItem.name} className="col-span-3" type="text" onChange={handleEditItem} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="w-full">
                            <Label htmlFor="calories" className="text-right">
                                Calories (g)
                            </Label>
                            <Input id="calories" value={editItem.calories} className="col-span-3" type="number" min={0} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="protein" className="text-right">
                                Protein (g)
                            </Label>
                            <Input id="protein" value={editItem.protein} className="col-span-3" type="number" min={0} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="carbs" className="text-right">
                                Carbs (g)
                            </Label>
                            <Input id="carbs" value={editItem.carbs} className="col-span-3" type="number" min={0} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="fat" className="text-right">
                                Fat (g)
                            </Label>
                            <Input id="fat" value={editItem.fat} className="col-span-3" type="number" min={0} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="sugar" className="text-right">
                                Sugar (g)
                            </Label>
                            <Input id="sugar" value={editItem.sugar} className="col-span-3" type="number" min={0} onChange={handleEditItem} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="amountPer" className="text-right">
                                Amount Per (g)
                            </Label>
                            <Input id="amountPer" value={editItem.amountPer} className="col-span-3" type="number" min={0} onChange={handleEditItem} />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="w-full">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
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
