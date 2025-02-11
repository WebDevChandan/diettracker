import { UserType } from "@/types/User";
import prisma from "@/utils/prisma";

export const createUser = async (user: UserType) => {
    try {
        return await prisma.user.create({
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
        await prisma.user.delete({
            where: {
                clerkUserID: clerkUserID,
            }
        });

    } catch (error) {
        console.error(error);
    }
}