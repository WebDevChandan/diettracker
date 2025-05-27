import { fetchUserEmail } from "@/utils/fetchUserEmail";


export default async function Home() {
    const userEmail = await fetchUserEmail();

    if (!userEmail) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-xl font-semibold">Please sign in to continue</h2>
            </div>
        )
    }

    return (
        <div id="diet_tracker" className="p-2 relative mt-14 sm:mt-8" >
            <div className="container mx-auto px-4">
                <h1 className="text-2xl mb-2 font-bold text-secondary-foreground sm:truncate sm:text-3xl sm:tracking-tight text-center w-full "> Your Listed Items</h1>
                <p className="text-sm text-muted-foreground text-center sm:text-lg">
                    Find your listed items here. You can add, edit, or delete items as needed.
                </p>
            </div>
        </div>
    );
}
