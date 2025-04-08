"use server";
import { FoodItemType } from "@/types/FoodItem";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";
import { createId } from '@paralleldrive/cuid2';
import { revalidatePath } from "next/cache";
import { addItemToList, deleteItemFromList, updateItemFromList } from "./listItem.action";

const isDuplicateItem = async (userEmail: string, foodItem: FoodItemType) => {
    const duplicateItemCount = await prisma.user.count({
        where: {
            email: userEmail,
            diet: {
                some: {
                    name: foodItem.name,
                    calories: foodItem.calories,
                    protein: foodItem.protein,
                    carbs: foodItem.carbs,
                    fat: foodItem.fat,
                    sugar: foodItem.sugar,
                    category: {
                        hasEvery: foodItem.category
                    },
                    listed: foodItem.listed,
                }
            }
        }
    });

    if (duplicateItemCount)
        throw new Error(`Duplicate item found in ${foodItem.category}`);
}

export const addFoodItem = async (newItem: FoodItemType) => {
    try {
        if (!newItem.category.length)
            throw new Error(`Invalid item category`);

        const userEmail = await fetchUserEmail();

        if (!userEmail)
            throw new Error(`User not found`);

        await isDuplicateItem(userEmail, newItem);

        let createdItemId = "";

        //Create NewItem with listing
        if (newItem.listed && !newItem.id) {
            const listedItemId: string | undefined = await addItemToList(newItem);

            if (!listedItemId)
                throw new Error(`Failed to add item to list`);

            createdItemId =
                await prisma.user.update({
                    where: {
                        email: userEmail,
                    },
                    data: {
                        diet: {
                            push: {
                                ...newItem,
                                id: createId(),
                                listed_item_id: `${listedItemId}`,
                            }
                        }
                    }
                }).then((user) => user.diet[user.diet.length - 1].id);

            revalidatePath("/");

            return {
                message: "Item added & listed successfully",
                newItemId: createdItemId,
            }

        } else {
            const itemDividedByCategory: FoodItemType[] = [];

            newItem.category.forEach((category: any) => {
                itemDividedByCategory.push({
                    ...newItem,
                    id: createId(),
                    category: [category],
                })
            });

            createdItemId =
                await prisma.user.update({
                    where: {
                        email: userEmail,
                    },
                    data: {
                        diet: {
                            push: itemDividedByCategory,
                        }
                    }
                }).then((user) => user.diet[user.diet.length - 1].id);
        }

        revalidatePath("/");

        return {
            message: "Item added successfully",
            newItemId: createdItemId,
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item`);
    }
}

export const updateFoodItem = async (editItem: FoodItemType, isListToggeled: boolean) => {
    try {
        const userEmail = await fetchUserEmail();

        if (!userEmail)
            throw new Error(`User not found`);

        if (!editItem.id)
            throw new Error(`Item ID not Found`);

        if (isListToggeled && !editItem.listed) {
            await deleteItemFromList(editItem);

            await prisma.user.update({
                where: {
                    email: userEmail,
                },
                data: {
                    diet: {
                        updateMany: {
                            where: {
                                id: editItem.id,
                            },
                            data: {
                                ...editItem
                            }
                        }
                    }
                }
            })

            revalidatePath("/");

            return {
                message: "Item updated & removed from list",
            }
        }

        else if (isListToggeled && editItem.listed) {

            const listedItemId: string | undefined = await addItemToList(editItem);

            if (!listedItemId)
                throw new Error(`Failed to add item to list`);

            await prisma.user.update({
                where: {
                    email: userEmail,
                },
                data: {
                    diet: {
                        push: {
                            ...editItem,
                            listed_item_id: `${listedItemId}`,
                        }
                    }
                }
            });

            revalidatePath("/");

            return {
                message: "Item updated & added to list",
            }
        }

        else if (editItem.listed) {
            await updateItemFromList(editItem);

            await prisma.user.update({
                where: {
                    email: userEmail,
                },
                data: {
                    diet: {
                        updateMany: {
                            where: {
                                id: editItem.id,
                            },
                            data: {
                                ...editItem
                            }
                        }
                    }
                }
            })

            revalidatePath("/");

            return {
                message: "Item & List updated successfully",
            }
        }

        await prisma.user.update({
            where: {
                email: userEmail,
            },
            data: {
                diet: {
                    updateMany: {
                        where: {
                            id: editItem.id,
                        },
                        data: {
                            ...editItem
                        }
                    }
                }
            }
        })

        revalidatePath("/");

        return {
            message: "Item updated successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item`);
    }
}

export const deleteFoodItem = async (deleteItem: FoodItemType, isListToggeled: boolean, currentCategory: string) => {
    try {
        const userEmail = await fetchUserEmail();

        if (!userEmail)
            throw new Error(`User not found`);

        if (!deleteItem.id)
            throw new Error(`Item ID not Found`);

        if (isListToggeled && !deleteItem.listed) {
            await deleteItemFromList(deleteItem);

            await prisma.user.update({
                where: {
                    email: userEmail,
                },
                data: {
                    diet: {
                        deleteMany: {
                            where: {
                                id: deleteItem.id,
                            },
                        }
                    }
                }
            })

            revalidatePath("/");

            return {
                message: "Item deleted & removed from list",
            }
        }

        else if (isListToggeled && deleteItem.listed) {
            await addItemToList(deleteItem);
            revalidatePath("/");

            return {
                message: "Item deleted & added to list",
            }
        }

        await prisma.user.update({
            where: {
                email: userEmail,
            },
            data: {
                diet: {
                    deleteMany: {
                        where: {
                            id: deleteItem.id,
                        },
                    }
                }
            }
        })

        revalidatePath("/");

        return {
            message: "Item deleted successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to delete item`);
    }
}