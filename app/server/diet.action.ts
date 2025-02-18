"use server";
import { FoodItemType } from "@/types/FoodItem";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { addItemToList } from "./listItem.action";

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
        if (newItem.listed)
            addItemToList(userEmail, newItem);

        revalidatePath("/");

        return {
            message: "Item added successfully",
            newItemId: createdItemId,
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item`);
    }
}

export const updateFoodItem = async (editItem: FoodItemType) => {
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

        revalidatePath("/");

        return {
            message: "Item updated successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item`);
    }
}

export const deleteFoodItem = async (deleteItem: FoodItemType) => {
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

        revalidatePath("/");

        return {
            message: "Item deleted successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to delete item`);
    }
}