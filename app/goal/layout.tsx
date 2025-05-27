import { ClerkLoaded } from "@clerk/nextjs";
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
            {children}
        </ClerkLoaded>
    )
}
