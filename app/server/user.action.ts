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