"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    router.push('/sign-in');
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled
        ? "bg-white/95 backdrop-blur-sm shadow-sm py-2"
        : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src="/assets/logo.svg"
              alt="DietTracker Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <span className={cn(
            "text-xl md:text-2xl font-bold transition-colors",
            isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
          )}>
            DietTracker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/calorie-calculator"
            className={cn(
              "text-sm font-medium transition-colors hover:text-dietGreen-400",
              isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
            )}
            prefetch={true}
          >
            Calorie Calculator
          </Link>
          <Link
            href="#features"
            className={cn(
              "text-sm font-medium transition-colors hover:text-dietGreen-400",
              isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
            )}
          >
            Features
          </Link>
          <Link
            href="#about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-dietGreen-400",
              isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
            )}
          >
            About
          </Link>
        </nav>

        {/* Call to Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <Button variant="dietOutline" size="sm" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="diet" size="sm" onClick={() => router.push("/sign-up")}>
              Get Started
            </Button>
          </SignedOut>

          <SignedIn>
            <Button variant="diet" size="sm" onClick={() => router.push("/tracker")}>
              Dashboard
            </Button>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dietBlue-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/calorie-calculator"
              className={cn(
                "text-sm font-medium transition-colors hover:text-dietGreen-400",
                isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
              )}
              prefetch={true}
            >
              Calorie Calculator
            </Link>
            <Link
              href="#features"
              className="text-dietBlue-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-dietBlue-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <SignedOut>
                <Button variant="dietOutline" size="sm" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="diet" size="sm" onClick={() => router.push("/sign-up")}>
                  Get Started
                </Button>
              </SignedOut>

              <SignedIn>
                <Button variant="diet" size="sm" onClick={() => router.push("/tracker")}>
                  Dashboard
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}