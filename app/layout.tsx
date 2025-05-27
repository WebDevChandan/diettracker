import { ScrollAnimationProvider } from "@/components/scroll-animation-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "./components/NavBar";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        <ClerkProvider>
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <Toaster richColors />
                    <ScrollAnimationProvider>
                        <Navbar />
                        {children}
                    </ScrollAnimationProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
