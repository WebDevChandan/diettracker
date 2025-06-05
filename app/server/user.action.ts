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
        const user = await prisma.user.findFirst({ where: { clerkUserID: clerkUserID } }).then(user => user);

        if (!user?.id || !user.email)
            throw new Error("User not found");

        await prisma.foodItemList.deleteMany({
            where: {
                user_id: user.id,
            }
        });

        await prisma.userFitness.deleteMany({
            where: {
                userEmail: user.email
            }
        })

        await prisma.user.delete({
            where: {
                id: user.id,
            }
        });

    } catch (error) {
        console.error("Error deleting user: " + ": " + error);
    }
}