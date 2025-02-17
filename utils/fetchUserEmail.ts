import { currentUser } from "@clerk/nextjs/server"

export const fetchUserEmail = async () => {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!user ||!userEmail) return null;

    return userEmail;
}