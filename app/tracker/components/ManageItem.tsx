"use client"
import { Button } from "@/components/ui/button";
import { CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/ui/MultiSelector";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useDialog from "@/app/hooks/useDialog";
import { cn } from "@/lib/utils";
import { FoodItemType } from "@/types/FoodItem";
import { createId } from "@paralleldrive/cuid2";
import { AllCategory } from "@prisma/client";
import { Command } from "cmdk";
import { Check, RotateCcw } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdInfoOutline, MdOutlinePlaylistAdd, MdOutlinePlaylistAddCheck } from "react-icons/md";
import { toast } from "sonner";
import { z } from 'zod';
import useDebounce from "../../hooks/useDebounce";
import { useDiet } from "../hook/useDiet";
import { useManageItemAction } from "../hook/useManageItemAction";
import { addFoodItem, deleteFoodItem, updateFoodItem } from "../server/diet.action";

const itemSchema = z.object({
    name: z.string().trim().min(3, { message: 'Invalid Food Name' }).max(30, { message: 'Name length exceeded' }),
    calories: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(5001, { message: "Min: 0g Max: 5000g" }),
    currentWeight: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2001, { message: "Min: 0g Max: 2000g" }),
    protein: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2001, { message: "Min: 0g Max: 2000g" }),
    carbs: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2001, { message: "Min: 0g Max: 2000g" }),
    fat: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2001, { message: "Min: 0g Max: 2000g" }),
    sugar: z.number().min(0, { message: "Min: 0g Max: 500g" }).max(2001, { message: "Min: 0g Max: 2000g" }),
    amountPer: z.number().min(1, { message: "Min: 1g Max: 2kg" }).max(2001, { message: "Min: 1g Max: 2kg" }),
    category: z.string().array().nonempty({ message: "At least 1 category required" }),
})

export default function ManageItem({ isNewItem, currentCategory }: { isNewItem: boolean, currentCategory: AllCategory[] }) {
    const { diet, newFoodItem, setDiet } = useDiet();
    const { isListedDialog, isUploadFileDialog, setIsUploadFileDialog, isAddNewItemToCatDialog, setIsAddNewItemToCatDialog, setIsAddNewItemDialog } = useDialog();
    const { foodItem, setFoodItem } = useManageItemAction();
    const [initialFoodItemstate, setInitialFoodItemstate] = useState(foodItem);
    const [hasItemChanged, setHasItemChanged] = useState(false);

    const [selectedListItem, setSelectedListItem] = useState<FoodItemType>({
        id: "",
        name: "",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: "",
    });
    const [userListedItems, setUserListedItems] = useState<FoodItemType[]>([]);
    const [recentlyListedItems, setRecentlyListedItems] = useState<FoodItemType[]>([]);
    const [hideListedItems, setHideListedItems] = useState(false);
    const commandInputRef = useRef<HTMLInputElement>(null);
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

    const CATEGORY_OPTIONS = [
        { label: AllCategory.breakfast, value: AllCategory.breakfast },
        { label: AllCategory.dinner, value: AllCategory.dinner },
        { label: AllCategory.lunch, value: AllCategory.lunch },
        { label: AllCategory.snacks, value: AllCategory.snacks },
        { label: AllCategory.other, value: AllCategory.other },
    ];

    //AI Image Analyzer
    useEffect(() => {
        if (!isUploadFileDialog && isNewItem)
            setFoodItem({
                ...newFoodItem,
                category: currentCategory,
            })
    }, [isUploadFileDialog, newFoodItem, isNewItem]);

    useEffect(() => {
        const userListedDiet = diet.filter(foodItem => foodItem.listed === true);
        const transformedData: FoodItemType[] = userListedDiet.filter(({ id, category, ...rest }) => category[0] !== currentCategory[0]);

        setRecentlyListedItems(transformedData);
    }, [diet]);

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

    }, [foodItem, hasItemChanged])

    useEffect(() => {
        if (foodItem.name === "" && selectedListItem.id) {
            setFoodItem(initialFoodItemstate);
            setSelectedListItem(initialFoodItemstate);
            setHideListedItems(false);

            if (commandInputRef.current) {
                commandInputRef.current.focus();
            }

        } else if (selectedListItem.id && !hideListedItems) {
            setFoodItem(selectedListItem);
            setFoodItem({
                ...selectedListItem,
                currentWeight: foodItem.currentWeight,
                category: [...currentCategory],
            })
            setHideListedItems(true);

        } else if ((foodItem.name.trim().length >= 3 && !selectedListItem.id
            && hasItemChanged && foodItem.name.toLocaleLowerCase() !== initialFoodItemstate.name.toLocaleLowerCase()) || (isNewItem && foodItem.name.trim().length < 3 && recentlyListedItems.length)
        ) {
            setHideListedItems(true);

        } else {
            setHideListedItems(false);
        }

    }, [foodItem.name, selectedListItem.id]);

    useEffect(() => {
        const fetchData = async () => {
            if (debounceValue.trim().length < 3) {
                if (foodItem.id)
                    setFoodItem({
                        ...initialFoodItemstate,
                        name: foodItem.name,
                    });

                return;
            };

            const isRecentlyListedItem = recentlyListedItems.some(item => item.name.trim().toLocaleLowerCase().startsWith(debounceValue.trim().toLocaleLowerCase()));

            if (isRecentlyListedItem) {
                return;
            }

            try {
                // const response = await fetchItemList();

                // if (!response?.ok) return;

                // const responseData: { data: FoodItemType[] } = await response.json();
                // const transformedData: FoodItemType[] = responseData.data.map(({ ...rest }) => ({
                //     ...rest,
                //     id: createId(),
                //     listed_item_id: rest.id,
                // }));

                // setUserListedItems(transformedData);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isNewItem)
            fetchData();

    }, [debounceValue]);

    useEffect(() => {
        let lastInteractionType = "mouse";

        const handleKeyboardInteraction = () => {
            lastInteractionType = "keyboard";
        };

        const handleMouseInteraction = (event: MouseEvent) => {
            if (commandListRef && !commandListRef.current?.contains(event.target as Node) && hideListedItems) {
                setHideListedItems(false);
            }

            if (commandInputRef && commandInputRef.current?.contains(event.target as Node) && isNewItem) {
                setHideListedItems(true);
            }

            lastInteractionType = "mouse";
        };

        const handleFocus = (event: FocusEvent) => {
            if (commandInputRef.current && event.target === commandInputRef.current && isNewItem) {
                setHideListedItems(true);
            }
        };

        const handleBlur = (event: FocusEvent) => {
            if ((commandInputRef.current && event.target === commandInputRef.current && lastInteractionType === "keyboard")) {
                setHideListedItems(false);
            }
        };

        document.addEventListener("keydown", handleKeyboardInteraction);
        document.addEventListener("mousedown", handleMouseInteraction);

        if (commandInputRef.current) {
            commandInputRef.current.addEventListener('focus', handleFocus);
            commandInputRef.current.addEventListener("blur", handleBlur);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyboardInteraction);
            document.removeEventListener("mousedown", handleMouseInteraction);

            if (commandInputRef.current) {
                commandInputRef.current.removeEventListener('focus', handleFocus);
                commandInputRef.current.removeEventListener("blur", handleBlur);
            }
        }

    }, [hideListedItems, isNewItem]);

    useEffect(() => {
        if (recentlyListedItems.length > 0)
            setHideListedItems(true);

        if (userListedItems.length > 0) {
            setHideListedItems(true);
        }

    }, [recentlyListedItems.length, userListedItems.length])

    const fetchItemList = async () => {
        if (debounceValue.trim().length < 3) {
            return;
        };

        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/itemlist?search=${encodeURIComponent(debounceValue.trim().toLowerCase())}`, {
                cache: "force-cache",
                next: {
                    revalidate: 3600,
                }
            });

            if (!response.ok)
                return;
            return response;

        } catch (error: any) {
            console.error("Error fetching item list:", error);
            toast.error(error.message || "Failed to fetch item list");
            return;
        }
    }

    const handleFoodItem = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const value = event.target.value === '' ? 0 : parseFloat(event.target.value);

        setFoodItem({ ...foodItem, [event.target.id]: value });
    };

    const handleFoodItemCategory = (value: string[]) => {
        setFoodItem((prevFoodItem) => {
            return {
                ...prevFoodItem,
                category: value as AllCategory[],
            };
        });

        if (selectedListItem.id) {
            setSelectedListItem((prevSelectedListItem) => ({
                ...prevSelectedListItem,
                category: currentCategory.length ? [currentCategory, ...prevSelectedListItem.category] as AllCategory[] : [...prevSelectedListItem.category] as AllCategory[],
            }));
        }
    };

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

        const isDuplicateItem = diet.some(item => item.name.toLocaleLowerCase() === foodItem.name.toLocaleLowerCase() && foodItem.name.toLocaleLowerCase() !== initialFoodItemstate.name.toLocaleLowerCase() && item.category.includes(currentCategory[0]) && hasItemChanged);

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

                            setIsAddNewItemToCatDialog({ ...isAddNewItemToCatDialog, [currentCategory[0]]: false })
                            setIsAddNewItemDialog(false)

                            setFoodItem({
                                id: '',
                                name: '',
                                calories: 0,
                                currentWeight: 0,
                                protein: 0,
                                carbs: 0,
                                fat: 0,
                                sugar: 0,
                                amountPer: 100,
                                category: [] as AllCategory[],
                                listed: foodItem.listed,
                                listed_item_id: "",
                            });

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

                            setIsAddNewItemToCatDialog({ ...isAddNewItemToCatDialog, [currentCategory[0]]: false });

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
                deleteFoodItem(foodItem, isListToggeled, currentCategory[0]),
                {
                    loading: 'Item Deleting...',
                    success: (data) => {
                        if (data.message) {
                            setDiet((prevDiet) => {
                                return prevDiet.filter(item => {
                                    return item.id !== initialFoodItemstate.id;
                                });
                            });

                            setIsAddNewItemToCatDialog({ ...isAddNewItemToCatDialog, [currentCategory[0]]: false });

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

    const handleToSelectItem = (listedFoodItem: FoodItemType, currentSelectedValue: string) => {
        setFoodItem({
            ...listedFoodItem,
            name: currentSelectedValue.search(listedFoodItem.name) === -1 ? "" : listedFoodItem.name,
            currentWeight: foodItem.currentWeight,
            category: [...currentCategory],
        })

        setSelectedListItem({
            ...listedFoodItem,
            category: currentCategory.length ? [currentCategory, ...listedFoodItem.category] as AllCategory[] : [...listedFoodItem.category] as AllCategory[],
        });
    }

    const handleManualSearchListItem = async () => {
        if (foodItem.name.trim().length < 3 || userListedItems.length) {
            return;
        };

        const response = await fetchItemList();

        if (!response?.ok) throw new Error("Failed to fetch data");

        const responseData: { data: FoodItemType[] } = await response.json();
        const transformedData: FoodItemType[] = responseData.data.map(({ ...rest }) => ({
            ...rest,
            id: createId(),
            listed_item_id: rest.id,
        }));

        setUserListedItems(transformedData);
    }

    return (
        <>
            <div className="grid gap-4">
                <div className="w-full">
                    <Label htmlFor="name" className="text-right">
                        Food Name*
                        {!isNewItem && <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <RotateCcw ref={resetItemRef} className="ml-2 mb-1 h-4 w-4 shrink-0 opacity-50 cursor-pointer inline" onClick={handleResetItem} />
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
                            removeName={() => {
                                if (isNewItem)
                                    setFoodItem(initialFoodItemstate)
                                else
                                    setFoodItem({ ...foodItem, name: "" })

                                if (commandInputRef.current) {
                                    commandInputRef.current.focus();
                                }
                            }}
                            uploadFile={() => {
                                setIsUploadFileDialog(true);
                            }}
                            manualSearchListItem={handleManualSearchListItem}
                            minLength={3}
                            maxLength={50}
                            disabled={selectedListItem.id ? true : false}
                            ref={commandInputRef}
                            aria-hidden={!isNewItem || selectedListItem.id ? true : false}   //Using it to hide to "uploadFile" feature
                        />

                        <div className="relative">
                            {
                                (foodItem.name || userListedItems.length > 0 || recentlyListedItems.length > 0) && isNewItem &&
                                <CommandList hidden={!hideListedItems} ref={commandListRef} className="absolute top-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                    {recentlyListedItems.length > 0 && <CommandGroup heading="Recently Listed Items">
                                        {recentlyListedItems.map((listedFoodItem) => (
                                            <CommandItem
                                                key={listedFoodItem.id}
                                                value={`${listedFoodItem.name} - ${listedFoodItem.category[0]}`}
                                                onSelect={(currentValue) => handleToSelectItem(listedFoodItem, currentValue)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {`${listedFoodItem.name} - ${listedFoodItem.category[0]}`}

                                            </CommandItem>
                                        ))}
                                    </CommandGroup>}

                                    {userListedItems.length > 0 && <CommandGroup heading="Stored Listed Items">
                                        {userListedItems.map((listedFoodItem) => (
                                            <CommandItem
                                                key={listedFoodItem.id}
                                                value={listedFoodItem.name}
                                                onSelect={(currentValue) => handleToSelectItem(listedFoodItem, currentValue)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {listedFoodItem.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        foodItem.name.search(listedFoodItem.name) === -1 ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>}
                                </CommandList>
                            }
                        </div>
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
                    <Input id="amountPer" value={foodItem.amountPer <= 2000 ? foodItem.amountPer : 2000} className="col-span-3" type="number" min={0} max={2001} onChange={handleFoodItem} disabled={selectedListItem.id ? true : false} />
                </div>
                <div className="w-full">
                    <Label htmlFor="currentWeight" className="text-right inline-flex gap-2 items-center mr-2">
                        Add Weight (g)
                    </Label>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <MdInfoOutline cursor="pointer" size={16} className="inline" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Food Intake Weight</p>
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
                    <TooltipProvider delayDuration={100}>
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
                        {foodItem.listed ? "Remove Item" : "List Item"}
                    </Button>
                </div>
            </div >

            {!isNewItem ?
                <div className="grid gap-4">
                    <div className="w-full">
                        <Label htmlFor="category" className="text-right">Category*</Label>
                        <Label htmlFor="category" className="text-red-500 text-xs ml-1">{invalidItemError.category}</Label>
                        <Select defaultValue={currentCategory[0]} disabled={true}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={currentCategory[0]} className="cursor-pointer hover:bg-accent">{currentCategory}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                :
                <div className="grid gap-4">
                    <div className="w-full">
                        <Label htmlFor="category" className="text-right">Category*</Label>
                        <Label htmlFor="category" className="text-red-500 text-xs ml-1">{invalidItemError.category}</Label>
                        <MultiSelector values={selectedListItem.id && currentCategory.length > 0 ? selectedListItem.category : foodItem.category} onValuesChange={handleFoodItemCategory} loop={false} defaultValue={currentCategory[0]}>
                            <MultiSelectorTrigger defaultValue={currentCategory} aria-disabled={currentCategory.length > 0 ? true : false} >
                                <MultiSelectorInput disabled={currentCategory.length > 0 ? true : false} placeholder={currentCategory.length > 0 ? `` : `Select your category`} />
                            </MultiSelectorTrigger>
                            <MultiSelectorContent>
                                <MultiSelectorList>
                                    {currentCategory.length > 0 || selectedListItem.id
                                        ? CATEGORY_OPTIONS.map((option, i) => (
                                            <MultiSelectorItem key={i} value={option.value} disabled={selectedListItem.category.includes(option.value)}>
                                                {option.label}
                                            </MultiSelectorItem>
                                        ))
                                        : CATEGORY_OPTIONS.map((option, i) => (
                                            <MultiSelectorItem key={i} value={option.value}>
                                                {option.label}
                                            </MultiSelectorItem>
                                        ))
                                    }
                                </MultiSelectorList>
                            </MultiSelectorContent>
                        </MultiSelector>
                    </div>
                </div>
            }

            <DialogFooter>
                {isNewItem
                    ? <>
                        <DialogClose asChild>
                            <Button type="button" variant={"dietOutline"} className="mt-2 sm:mt-0"> Cancel </Button>
                        </DialogClose>
                        {!isListedDialog ? <Button type="submit" onClick={handleAddFoodItem} disabled={!hasItemChanged ? true : false}>Add Item</Button> : <Button type="submit" onClick={handleAddFoodItem}>List Item</Button>}
                    </>
                    : <div className="flex justify-center items-center gap-2">
                        <Button type="submit" onClick={handleDeleteFoodItem} className="hover:bg-red-800">Delete Item</Button>
                        <Button type="submit" onClick={handleUpdateFoodItem}>Update Item</Button>
                    </div>
                }

            </DialogFooter>
        </>
    )

}
