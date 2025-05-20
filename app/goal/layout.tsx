import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "DietTracker",
    description: "Set your Daily Calorie Goals",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkLoaded>
            <header className="flex justify-end items-center p-4 gap-4 h-16 absolute w-full">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            {children}
        </ClerkLoaded>
    )
}
