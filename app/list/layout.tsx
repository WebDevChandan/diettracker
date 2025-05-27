import {
    ClerkLoaded,
    ClerkLoading
} from '@clerk/nextjs';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "DietTracker",
    description: "Your Listed Items - Track your Macros and Calories of your Diet",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <ClerkLoading>
                <div className="flex justify-center items-center h-screen text-2xl">
                    loading....
                </div>
            </ClerkLoading>
            <ClerkLoaded>
                {children}
            </ClerkLoaded>
        </>

    )
}
