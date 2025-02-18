import { FoodItemType } from "@/types/FoodItem";
import prisma from "@/utils/prisma";

const fetchUserId = async (userEmail: string) => {
    const userId = await prisma.user.findFirst({ where: { email: userEmail } }).then(user => user?.id);

    if (!userId) {
        throw new Error("User ID not found");
    }
}

export const addItemToList = async (userEmail: string, foodItem: FoodItemType) => {
    try {
        const userId = await fetchUserId(userEmail);

        await prisma.foodItemList.create({
            data: {
                ...foodItem,
                user_id: userId!,
            }
        })

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item to list`);
    }
}