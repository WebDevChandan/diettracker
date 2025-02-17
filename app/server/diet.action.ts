"use server";
import { FoodItemType } from "@/types/FoodItem";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addFoodItem = async (newItem: FoodItemType) => {
    try {
        if (!newItem.category)
            throw new Error(`Invalid item category`);

        const userEmail = await fetchUserEmail();

        if (!userEmail)
            throw new Error(`User not found`);

        const duplicateItemCount = await prisma.user.count({
            where: {
                email: userEmail,
                diet: {
                    some: {
                        name: newItem.name,
                        category: newItem.category,
                    }
                }
            }
        });

        if (duplicateItemCount)
            throw new Error(`Duplicate item found`);

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
        const userId = await prisma.user.findFirst({ where: { email: userEmail } }).then(user => user?.id);

        if (!userId) {
            throw new Error("User ID not found");
        }

        await prisma.foodItemList.create({
            data: {
                name: "Test Food Item",
                calories: 100,
                protein: 5,
                fat: 2,
                carbs: 7,
                sugar: 0,
                amountPer: 100,
                category: AllCategory.breakfast,
                user_id: userId,
            }
        })

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