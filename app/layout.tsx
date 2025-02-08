import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diet Tracker",
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
          <ClerkLoading>
            <div className="flex justify-center items-center h-screen text-2xl">
              loading....
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <header className="flex justify-end items-center p-4 gap-4 h-16 absolute w-full">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  )
}
