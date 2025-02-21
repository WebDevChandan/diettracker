import { FoodItemType } from "@/types/FoodItem";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import prisma from "@/utils/prisma";

const fetchUserId = async () => {
    const userEmail = await fetchUserEmail();
    if (!userEmail)
        throw new Error(`User not found`);

    const userId = await prisma.user.findFirst({ where: { email: userEmail } }).then(user => user?.id);

    if (!userId) {
        throw new Error("User ID not found");
    }

    return userId;
}

export const addItemToList = async (foodItem: FoodItemType, createdItemId: string) => {
    try {
        const userId = await fetchUserId();

        if (!createdItemId)
            throw new Error(`Item ID not Found`);

        await prisma.foodItemList.create({
            data: {
                name: foodItem.name,
                currentWeight: foodItem.currentWeight,
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

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item to list`);
    }
}

export const updateItemFromList = async (foodItem: FoodItemType) => {
    try {
        const userId = await fetchUserId();

        await prisma.foodItemList.update({
            where: {
                user_item_id: foodItem.id,
                user_id: userId!,
            },
            data: {
                name: foodItem.name,
                currentWeight: foodItem.currentWeight,
                calories: foodItem.calories,
                protein: foodItem.protein,
                carbs: foodItem.carbs,
                fat: foodItem.fat,
                sugar: foodItem.sugar,
                amountPer: foodItem.amountPer,
                category: foodItem.category,
            }
        })

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item in list`);
    }
}

export const deleteItemFromList = async (itemId: string) => {
    try {
        const userId = await fetchUserId();

        await prisma.foodItemList.delete({
            where: {
                user_item_id: itemId,
                user_id: userId!,
            }
        })

    } catch (error: any) {
        throw new Error(error.message || `Failed to delete item from list`);
    }
}

export const fetchItemListOfUser = async () => {
    try {
        const userId = await fetchUserId();

        return await prisma.foodItemList.findMany({
            where: {
                user_id: userId!,
            }
        })

    } catch (error: any) {
        throw new Error(error.message || `Failed to fetch item list`);
    }
}