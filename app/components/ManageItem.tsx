"use client"
import { Button } from "@/components/ui/button";
import { CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useDialog from "@/hooks/useDialog";
import { cn } from "@/lib/utils";
import { FoodItemType } from "@/types/FoodItem";
import { AllCategory } from "@prisma/client";
import { Command } from "cmdk";
import { Check, RotateCcw } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdInfoOutline, MdOutlinePlaylistAdd, MdOutlinePlaylistAddCheck } from "react-icons/md";
import { toast } from "sonner";
import { z } from 'zod';
import useDebounce from "../hooks/useDebounce";
import { useDiet } from "../hooks/useDiet";
import { useManageItemAction } from "../hooks/useManageItemAction";
import { addFoodItem, deleteFoodItem, updateFoodItem } from "../server/diet.action";


const itemSchema = z.object({
    name: z.string().trim().min(3, { message: 'Invalid Food Name' }).max(30, { message: 'Name length exceeded' }),
    calories: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(5000, { message: "Min: 0g Max: 5000g" }),
    currentWeight: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2000, { message: "Min: 0g Max: 2000g" }),
    protein: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2000, { message: "Min: 0g Max: 2000g" }),
    carbs: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2000, { message: "Min: 0g Max: 2000g" }),
    fat: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2000, { message: "Min: 0g Max: 2000g" }),
    sugar: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2000, { message: "Min: 0g Max: 2000g" }),
    amountPer: z.number().min(1, { message: "Min: 1g Max: 2kg" }).max(2000, { message: "Min: 1g Max: 2kg" }),
    category: z.string().min(1, { message: "Select at least one category" }),
})

export default function ManageItem({ isNewItem, currentCategory, isListedItem = false }: { isNewItem: boolean, currentCategory: AllCategory, isListedItem?: boolean }) {
    const { diet, setDiet } = useDiet();
    const { open, setOpen } = useDialog();
    const { foodItem, setFoodItem } = useManageItemAction();

    const [initialFoodItemstate, setInitialFoodItemstate] = useState(foodItem);
    const [hasItemChanged, setHasItemChanged] = useState(false);

    const [selectedListItem, setSelectedListItem] = useState<FoodItemType>({
        name: "",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: "" as AllCategory,
        listed: false,
    });
    const [userListedItems, setUserListedItems] = useState<FoodItemType[]>([]);
    const [hideListedItems, setHideListedItems] = useState(false);
    const commandListRef = useRef<HTMLDivElement>(null);
    const resetItemRef = useRef<SVGSVGElement>(null);

    const debounceValue = useDebounce(foodItem.name, 500);

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

    useEffect(() => {
        if (
            initialFoodItemstate.name !== foodItem.name ||
            initialFoodItemstate.calories !== foodItem.calories ||
            initialFoodItemstate.currentWeight !== foodItem.currentWeight ||
            initialFoodItemstate.protein !== foodItem.protein ||
            initialFoodItemstate.carbs !== foodItem.carbs ||
            initialFoodItemstate.fat !== foodItem.fat ||
            initialFoodItemstate.sugar !== foodItem.sugar ||
            initialFoodItemstate.amountPer !== foodItem.amountPer ||
            initialFoodItemstate.category !== foodItem.category ||
            initialFoodItemstate.listed !== foodItem.listed
        )
            setHasItemChanged(true);
        else
            setHasItemChanged(false);

        // if (foodItem.category !== currentCategory) {
        //     setFoodItem({
        //         ...foodItem,
        //         category: currentCategory,
        //     });
        // }

        if (foodItem.name === "" && selectedListItem.id) {
            setFoodItem(initialFoodItemstate);
            setSelectedListItem(initialFoodItemstate);
            setHideListedItems(false);

        } else if (selectedListItem.id && !hideListedItems) {
            setFoodItem(selectedListItem);
            setHideListedItems(true);

        } else if (foodItem.name.trim().length >= 3 && !selectedListItem.id
            && hasItemChanged && foodItem.name.toLocaleLowerCase() !== initialFoodItemstate.name.toLocaleLowerCase()
        ) {
            setHideListedItems(true);

        } else {
            setHideListedItems(false);
        }

    }, [foodItem, selectedListItem, hasItemChanged])

    useEffect(() => {
        const fetchData = async () => {
            if (!debounceValue) {
                if (foodItem.id)
                    setFoodItem({
                        ...initialFoodItemstate,
                        name: foodItem.name,
                    });

                return;
            };

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/itemlist?search=${debounceValue.trim().toLocaleLowerCase()}`, {
                    cache: "force-cache",
                });

                if (!response.ok) throw new Error("Failed to fetch data");

                const { data } = await response.json();
                setUserListedItems(data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isNewItem)
            fetchData();

    }, [debounceValue]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (commandListRef && !commandListRef.current?.contains(event.target as Node) && hideListedItems) {
                setHideListedItems(false);
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        }

    }, [hideListedItems]);

    const handleFoodItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const value = event.target.value === '' ? 0 : parseFloat(event.target.value);

        if (selectedListItem && selectedListItem.id) {
            setSelectedListItem({
                ...selectedListItem,
                [event.target.id]: value,
            });

        } else {
            setFoodItem({ ...foodItem, [event.target.id]: value });
        }
    };

    const handleFoodItemCategory = (value: string) => {
        if (!value) return

        if (selectedListItem && selectedListItem.id) {
            setSelectedListItem({
                ...selectedListItem,
                category: value as AllCategory,
            });

        } else {
            setFoodItem({ ...foodItem, category: value as AllCategory });
        }

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
            category: foodItem.category,
        })

        if (!validation.success) {
            validation.error.issues.map(issue => {
                setInvalidItemError((prevErr) => {
                    return { ...prevErr, [issue.path[0]]: issue.message };
                });
            })
        }

        const isDuplicateItem = diet.some(item => item.name.toLocaleLowerCase() === foodItem.name.toLocaleLowerCase() && foodItem.name.toLocaleLowerCase() !== initialFoodItemstate.name.toLocaleLowerCase() && item.category === currentCategory && hasItemChanged);

        return {
            isValidItem: validation.success,
            isDuplicateItem: isDuplicateItem,
        };
    }

    const handleAddFoodItem = async () => {
        const { isValidItem, isDuplicateItem } = handleItemValidation() as { isValidItem: boolean, isDuplicateItem: boolean };

        if (isValidItem && isDuplicateItem)
            return toast.info(`Duplicate item found in ${currentCategory}`);

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
                                category: "" as AllCategory,
                                listed: foodItem.listed,
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
        if (!hasItemChanged) {
            return toast.info(`No Changes Found!`);
        }

        const { isValidItem, isDuplicateItem } = handleItemValidation() as { isValidItem: boolean, isDuplicateItem: boolean };

        if (isValidItem && isDuplicateItem)
            return toast.info(`Duplicate item found in ${foodItem.category}`);

        if (isValidItem && !isDuplicateItem) {
            const isListToggeled = initialFoodItemstate.listed !== foodItem.listed;

            toast.promise(
                updateFoodItem(foodItem, isListToggeled),
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
        if (confirm(`Are you sure you want to delete "${foodItem.name}"?`)) {
            const isListToggeled = initialFoodItemstate.listed !== foodItem.listed;

            toast.promise(
                deleteFoodItem(foodItem, isListToggeled),
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
    }

    const handleAddItemToList = () => {
        setFoodItem({
            ...foodItem,
            listed: !foodItem.listed,
        });
    }

    const handleFoodItemName = (search: string): void => {
        setFoodItem({
            ...foodItem,
            name: search,
        });
    }

    const handleResetItem = () => {
        if (resetItemRef.current) {
            resetItemRef.current.classList.add('animate-reverse-spin');

            setTimeout(() => {
                resetItemRef.current?.classList.remove('animate-reverse-spin');
                setFoodItem(initialFoodItemstate);
            }, 500);
        }
    }

    console.log(foodItem);
    return (
        <>
            <div className="grid gap-4">
                <div className="w-full">
                    <Label htmlFor="name" className="text-right">
                        Food Name*
                        {!isNewItem && <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <RotateCcw ref={resetItemRef} className="ml-1 h-4 w-4 shrink-0 opacity-50 cursor-pointer inline" onClick={handleResetItem} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span>Reset Food Item</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>}
                    </Label>
                    <Label htmlFor="name" className="text-red-500 text-xs ml-1">{invalidItemError.name}</Label>
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput
                            placeholder="Type a name or search..."
                            onValueChange={handleFoodItemName}
                            value={foodItem.name}
                            removeName={() => isNewItem ? setFoodItem(initialFoodItemstate) : setFoodItem({ ...foodItem, name: "" })}
                            disabled={selectedListItem.id ? true : false}
                            minLength={3}
                            maxLength={50}
                        />

                        {foodItem.name &&
                            <CommandList hidden={!hideListedItems} ref={commandListRef}>
                                <CommandGroup heading="Your Listed Items">
                                    {userListedItems.map((foodItem) => (
                                        <CommandItem
                                            key={foodItem.id}
                                            value={foodItem.name}
                                            onSelect={(currentValue) => {
                                                setFoodItem({
                                                    ...foodItem,
                                                    name: currentValue.search(foodItem.name) === -1 ? "" : currentValue,
                                                    category: foodItem.category !== currentCategory ? currentCategory : foodItem.category
                                                })
                                                setSelectedListItem(foodItem);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {foodItem.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    foodItem.name.search(foodItem.name) === -1 ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>}
                    </Command>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2">
                <div className="w-full">
                    <Label htmlFor="calories" className="text-right">Calories (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="calories" className="text-red-500 text-xs ml-1 block">{invalidItemError.calories}</Label>
                    <Input id="calories" value={foodItem.calories} className="col-span-3" type="number" min={0} max={5000} onChange={handleFoodItem} disabled={selectedListItem.id ? true : false} />
                </div>
                <div className="w-full">
                    <Label htmlFor="protein" className="text-right">Protein (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="protein" className="text-red-500 text-xs ml-1 block">{invalidItemError.protein}</Label>
                    <Input id="protein" value={foodItem.protein} className="col-span-3" type="number" min={0} max={2000} onChange={handleFoodItem} disabled={selectedListItem.id ? true : false} />
                </div>
                <div className="w-full">
                    <Label htmlFor="carbs" className="text-right">Carbs (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="carbs" className="text-red-500 text-xs ml-1 block">{invalidItemError.carbs}</Label>
                    <Input id="carbs" value={foodItem.carbs} className="col-span-3" type="number" min={0} max={2000} onChange={handleFoodItem} disabled={selectedListItem.id ? true : false} />
                </div>
                <div className="w-full">
                    <Label htmlFor="fat" className="text-right">Fat (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="fat" className="text-red-500 text-xs ml-1 block">{invalidItemError.fat}</Label>
                    <Input id="fat" value={foodItem.fat} className="col-span-3" type="number" min={0} max={2000} onChange={handleFoodItem} disabled={selectedListItem.id ? true : false} />
                </div>
                <div className="w-full">
                    <Label htmlFor="sugar" className="text-right">Sugar (per {foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} g)</Label>
                    <Label htmlFor="sugar" className="text-red-500 text-xs ml-1 block">{invalidItemError.sugar}</Label>
                    <Input id="sugar" value={foodItem.sugar} className="col-span-3" type="number" min={0} max={2000} onChange={handleFoodItem} disabled={selectedListItem.id ? true : false} />
                </div>
                <div className="w-full">
                    <Label htmlFor="amountPer" className="text-right">Amount Per* (g)</Label>
                    <Label htmlFor="amountPer" className="text-red-500 text-xs ml-1 block">{invalidItemError.amountPer}</Label>
                    <Input id="amountPer" value={foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} className="col-span-3" type="number" min={0} max={2000} onChange={handleFoodItem} disabled={selectedListItem.id ? true : false} />
                </div>
                <div className="w-full">
                    <Label htmlFor="currentWeight" className="text-right inline-flex gap-2 items-center mr-2">
                        Add Weight (g)
                    </Label>
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <MdInfoOutline cursor="pointer" size={16} className="inline" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Food Intake Weight</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {invalidItemError.currentWeight && <Label htmlFor="currentWeight" className="text-red-500 text-xs ml-1 block">{invalidItemError.currentWeight}</Label>}
                    <Input id="currentWeight" value={foodItem.currentWeight} className="col-span-3" type="number" min={0} max={2000} onChange={handleFoodItem} />
                </div>
                <div className="w-full">
                    <Label htmlFor="currentWeight" className="text-right inline-flex gap-2 items-center mr-2">
                        Add Item to List
                    </Label>
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <MdInfoOutline cursor="pointer" size={16} className="inline" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Save For Later Use</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button type="button" size={"sm"}
                        className={`${foodItem.listed ? 'bg-slate-900 hover:bg-red-800' : 'bg-slate-700 hover:bg-slate-800'} outline-none flex`}
                        onClick={handleAddItemToList}
                        disabled={selectedListItem.id ? true : false}
                    >
                        {foodItem.listed ? <MdOutlinePlaylistAddCheck /> : <MdOutlinePlaylistAdd />}
                        {foodItem.listed ? "Remove Item" : "Add Item"}
                    </Button>
                </div>
            </div >

            <div className="grid gap-4">
                <div className="w-full">
                    <Label htmlFor="category" className="text-right">Category*</Label>
                    <Label htmlFor="category" className="text-red-500 text-xs ml-1">{invalidItemError.category}</Label>
                    <Select onValueChange={handleFoodItemCategory} defaultValue={currentCategory} disabled={currentCategory ? true : false}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="breakfast" className="cursor-pointer hover:bg-accent">Breakfast</SelectItem>
                                <SelectItem value="lunch" className="cursor-pointer hover:bg-accent">Lunch</SelectItem>
                                <SelectItem value="dinner" className="cursor-pointer hover:bg-accent">Dinner</SelectItem>
                                <SelectItem value="snacks" className="cursor-pointer hover:bg-accent">Snacks</SelectItem>
                                <SelectItem value="other" className="cursor-pointer hover:bg-accent">Other</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter>
                {isNewItem
                    ? <Button type="submit" onClick={handleAddFoodItem}>Add Item</Button>
                    : <div className="flex justify-center items-center gap-2">
                        <Button type="submit" onClick={handleDeleteFoodItem} className="hover:bg-red-800">Delete Item</Button>
                        <Button type="submit" onClick={handleUpdateFoodItem}>Update Item</Button>
                    </div>
                }
            </DialogFooter>
        </>
    )
}
