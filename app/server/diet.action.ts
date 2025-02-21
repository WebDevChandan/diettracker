"use server";
import { FoodItemType } from "@/types/FoodItem";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";
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
                    category: foodItem.category,
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
        if (!newItem.category)
            throw new Error(`Invalid item category`);

        const userEmail = await fetchUserEmail();

        if (!userEmail)
            throw new Error(`User not found`);

        await isDuplicateItem(userEmail, newItem);

        const createdItemId =
            await prisma.user.update({
                where: {
                    email: userEmail,
                },
                data: {
                    diet: {
                        push: newItem
                    }
                }
            }).then((user) => user.diet[user.diet.length - 1].id);

        //List Food Items of User
        if (newItem.listed) {
            await addItemToList(newItem, createdItemId);

            revalidatePath("/");

            return {
                message: "Item added & listed successfully",
                newItemId: createdItemId,
            }
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

        await isDuplicateItem(userEmail, editItem);

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

        if (isListToggeled && !editItem.listed) {
            await deleteItemFromList(editItem.id);

            revalidatePath("/");

            return {
                message: "Item updated & removed from list",
            }
        }

        else if (isListToggeled && editItem.listed) {
            await addItemToList(editItem, editItem.id);
            revalidatePath("/");

            return {
                message: "Item updated & added to list",
            }
        }

        await updateItemFromList(editItem);

        revalidatePath("/");

        return {
            message: "Item updated successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item`);
    }
}

export const deleteFoodItem = async (deleteItem: FoodItemType, isListToggeled: boolean) => {
    try {
        const userEmail = await fetchUserEmail();

        if (!userEmail)
            throw new Error(`User not found`);

        if (!deleteItem.id)
            throw new Error(`Item ID not Found`);

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

        if (isListToggeled && !deleteItem.listed) {
            await deleteItemFromList(deleteItem.id);
            revalidatePath("/");

            return {
                message: "Item deleted & removed from list",
            }
        }

        else if (isListToggeled && deleteItem.listed) {
            await addItemToList(deleteItem, deleteItem.id);
            revalidatePath("/");

            return {
                message: "Item deleted & added to list",
            }
        }

        revalidatePath("/");

        return {
            message: "Item deleted successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to delete item`);
    }
}