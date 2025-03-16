import { FoodItemType } from "@/types/FoodItem";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import { fetchUserId } from "@/utils/fetchUserId";
import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";

const isExistedItem = async (listedItemId: string, userId: string) => {
    return await prisma.foodItemList.findUnique({
        where: {
            id: listedItemId,
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

export const addItemToList = async (foodItem: FoodItemType,) => {
    try {
        const userId = await fetchUserId();

        if (!userId)
            throw new Error(`User or Item ID not Found`);

        const duplicateItem = await isDuplicateItem(foodItem.name, userId);

        if (!duplicateItem) {
            const listedItemId = await prisma.foodItemList.create({
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
                }
            });

            return listedItemId.id;
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item to list`);
    }
}

export const updateItemFromList = async (foodItem: FoodItemType) => {
    try {
        const userId = await fetchUserId();

        if (!userId || !foodItem.id) throw new Error(`User or Item not found`);

        const item = await isExistedItem(foodItem.listed_item_id, userId);

        if (item) {
            await prisma.foodItemList.update({
                where: {
                    id: foodItem.listed_item_id,
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
                }
            })
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item in list`);
    }
}

export const deleteItemFromList = async (deleteItem: FoodItemType) => {
    try {
        const userId = await fetchUserId();

        if (!userId || !deleteItem.listed_item_id) throw new Error(`User or ItemID not found`);

        const existedListItem = await isExistedItem(deleteItem.listed_item_id, userId);

        if (existedListItem) {
            if (existedListItem.category.includes(deleteItem.category[0]) && existedListItem.category.length > 1) {
                await prisma.foodItemList.update({
                    where: {
                        id: deleteItem.listed_item_id,
                        user_id: userId,
                    },
                    data: {
                        category: {
                            set: existedListItem.category.filter((category: AllCategory) => category !== deleteItem.category[0])
                        }
                    }
                });

            } else if (existedListItem.category.includes(deleteItem.category[0]) && existedListItem.category.length === 1) {
                await prisma.foodItemList.delete({
                    where: {
                        id: deleteItem.listed_item_id,
                        user_id: userId,
                    }
                });
            }
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