import { UserType } from "@/types/User";
import prisma from "@/utils/prisma";

export const createUser = async (user: UserType) => {
    try {
        await prisma.user.create({
            data: {
                ...user,
            }
        });

    } catch (error) {
        console.error(error);
    }
}

export const deleteUser = async (clerkUserID: string) => {
    try {
        const userId = await prisma.user.findFirst({ where: { clerkUserID: clerkUserID } }).then(user => user?.id);

        if (!userId)
            throw new Error("User not found");

        await prisma.foodItemList.deleteMany({
            where: {
                user_id: userId,
            }
        });

        await prisma.user.delete({
            where: {
                id: userId,
            }
        });

    } catch (error) {
        console.error("Error deleting user: " + ": " + error);
    }
}