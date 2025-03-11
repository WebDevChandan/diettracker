import { fetchUserEmail } from "./fetchUserEmail";
import prisma from "./prisma";

export const fetchUserId = async () => {
    const userEmail = await fetchUserEmail();
    
    if (!userEmail)
        throw new Error(`User not found`);

    const userId = await prisma.user.findFirst({ where: { email: userEmail } }).then(user => user?.id);

    if (!userId) {
        throw new Error("User ID not found");
    }

    return userId;
}