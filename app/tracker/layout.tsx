import { ScrollAnimationProvider } from '@/components/scroll-animation-provider';
import {
    ClerkLoaded,
    ClerkLoading,
    SignedIn,
    UserButton
} from '@clerk/nextjs';
import type { Metadata } from "next";
import { Navbar } from '../components/NavBar';

export const metadata: Metadata = {
    title: "DietTracker",
    description: "Track your Macros and Calories of your Diet",
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
                <ScrollAnimationProvider>
                    {/* <div className="flex justify-end items-center p-4 gap-4 h-16 absolute w-full"> */}
                        <Navbar />
                    {/* </div> */}
                    {children}
                </ScrollAnimationProvider>
            </ClerkLoaded>
        </>

    )
}
