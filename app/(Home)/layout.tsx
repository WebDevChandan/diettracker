import { ScrollAnimationProvider } from "@/components/scroll-animation-provider";
import type { Metadata } from "next";
import { Navbar } from "../components/NavBar";
import "../globals.css";

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
    <ScrollAnimationProvider>
      <Navbar />
      {children}
    </ScrollAnimationProvider>
  )
}
