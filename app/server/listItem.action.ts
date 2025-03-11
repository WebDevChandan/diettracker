import { FoodItemType } from "@/types/FoodItem";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import { fetchUserId } from "@/utils/fetchUserId";
import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";

const isExistedItem = async (itemId: string, userId: string) => {
    return await prisma.foodItemList.findUnique({
        where: {
            user_item_id: itemId,
            user_id: userId!,
        }
    });
}

const isDuplicateItem = async (foodName: string, userID: string) => {
    return await prisma.foodItemList.count({
        where: {
            user_id: userID,
            name: foodName,
        }
    });
}

export const addItemToList = async (foodItem: FoodItemType, createdItemId: string) => {
    try {
        const userId = await fetchUserId();

        if (!userId || !createdItemId)
            throw new Error(`User or Item ID not Found`);

        const duplicateItem = await isDuplicateItem(foodItem.name, userId);

        if (!duplicateItem) {
            await prisma.foodItemList.create({
                data: {
                    name: foodItem.name,
                    calories: foodItem.calories,
                    protein: foodItem.protein,
                    carbs: foodItem.carbs,
                    fat: foodItem.fat,
                    sugar: foodItem.sugar,
                    amountPer: foodItem.amountPer,
                    category: foodItem.category,
                    listed: foodItem.listed,
                    user_id: userId!,
                    user_item_id: createdItemId,
                }
            })
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item to list`);
    }
}

export const updateItemFromList = async (foodItem: FoodItemType) => {
    try {
        const userId = await fetchUserId();

        if (!userId || !foodItem.id) throw new Error(`User or Item not found`);

        const item = await isExistedItem(foodItem.id, userId);

        if (item) {
            await prisma.foodItemList.update({
                where: {
                    user_item_id: foodItem.id,
                    user_id: userId!,
                },
                data: {
                    name: foodItem.name,
                    calories: foodItem.calories,
                    protein: foodItem.protein,
                    carbs: foodItem.carbs,
                    fat: foodItem.fat,
                    sugar: foodItem.sugar,
                    amountPer: foodItem.amountPer,
                    category: foodItem.category,
                }
            })
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item in list`);
    }
}

export const deleteItemFromList = async (itemId: string) => {
    try {
        const userId = await fetchUserId();

        if (!userId || !itemId) throw new Error(`User not found`);

        const item = await isExistedItem(itemId, userId);

        if (item) {
            await prisma.foodItemList.delete({
                where: {
                    user_item_id: itemId,
                    user_id: userId,
                }
            });
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to delete item from list`);
    }
}

export const fetchItemListOfUser = async () => {
    try {
        const userId = await fetchUserId();

        if (!userId) throw new Error(`User not found`);

        return await prisma.foodItemList.findMany({
            where: {
                user_id: userId,
            }
        })

    } catch (error: any) {
        throw new Error(error.message || `Failed to fetch item list`);
    }
}