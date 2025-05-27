"use client";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, SignIn, SignOutButton, UserButton, UserProfile, useUser } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { Calculator, ClipboardList, Cpu, DotIcon, Goal, Home, Info, LayoutDashboard, ListCheck, LogOut, Menu, Settings, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { set } from 'zod';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  // const profileMobileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const isProtectedPath = ["/tracker", "/list", "/account"].some(path => pathname.includes(path));

  // Desktop Profile Dropdown Menu - Signed In
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    // Close dropdown on Escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isProfileOpen])

  //Mobile Default Menu (Signout) & Profile Dropdown Menu (Sign-In)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if ((mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) ||
        (profileRef.current && !profileRef.current.contains(event.target as Node))) {
        setMobileMenuOpen(false)
      }
    }

    // Close dropdown on Escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      if (window.scrollY > 50 && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setIsProfileOpen(false);
      }

      if (window.scrollY > 50 && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, isProfileOpen]);

  const handleLogin = () => {
    router.push('/sign-in');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleProfileMenuClose = () => {
    if (isProfileOpen)
      setIsProfileOpen(false);

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  return (
    <header className={cn(
      "fixed top-0 w-full z-10 transition-all duration-300",
      isScrolled
        ? "bg-white/95 backdrop-blur-sm shadow-sm py-2"
        : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop Navigation Links */}
        {!isProtectedPath && <nav className="hidden md:flex items-center space-x-8">
          <SignedOut>
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
          </SignedOut>

          <SignedIn>
            <Link
              href="/goal"
              className={cn(
                "text-sm font-medium transition-colors hover:text-dietGreen-400",
                isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
              )}
              prefetch={true}
            >
              Goal
            </Link>
          </SignedIn>

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
        </nav>}

        {/* Desktop Login & Get Started Buttons - Signed-Out*/}
        <SignedOut>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="dietOutline" size="sm" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="diet" size="sm" onClick={() => router.push("/sign-up")}>
              Get Started
            </Button>
          </div>
        </SignedOut>

        {/* Mobile Default Hamburger Menu Button - Signed-Out */}
        <SignedOut>
          <button
            className="md:hidden text-dietBlue-700 outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </SignedOut>

        {/* Desktop User Profile Avatar & Dropdown - Signed In*/}
        <SignedIn>
          <div className="hidden md:flex items-center space-x-4">
            {!isProtectedPath && <Button variant="diet" size="sm" onClick={() => router.push("/tracker")}>
              Tracker Dashboard
            </Button>}

            {/* Mobile Profile Avatar */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-3"
                aria-label="User profile menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <Image
                  src={user ? user.imageUrl : ""}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  priority={false}
                />
              </button>

              {/*Desktop User Profile Dropdown Menu - Signed In */}
              {isProfileOpen && (
                <div ref={profileRef} className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={user ? user.imageUrl : ""}
                          alt="User avatar"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          priority={false}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-500 truncate">{user?.firstName}</div>
                        <div className="text-xs text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {pathname !== "/"
                      && <button
                        onClick={() => { router.push("/"); handleProfileMenuClose() }}
                        className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                        role="menuitem"
                      >
                        <Home className="w-4 h-4 text-gray-500 font-bold" />
                        <span>Home Page</span>
                      </button>}

                    {!isProtectedPath
                      && <button
                        onClick={() => { router.push("/tracker"); handleProfileMenuClose() }}
                        className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                        role="menuitem"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-500" />
                        <span>Tracker Dashboard</span>
                      </button>}

                    <button
                      onClick={() => { router.push("/goal"); handleProfileMenuClose() }}
                      className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <Goal className="w-4 h-4 text-gray-500 font-bold" />
                      <span>Set Goal</span>
                    </button>

                    <button
                      onClick={() => { router.push("/list"); handleProfileMenuClose() }}
                      className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <ListCheck className="w-4 h-4 text-gray-500 font-bold" />
                      <span>Your Listed Items</span>
                    </button>

                    <button
                      onClick={() => { router.push("/account"); handleProfileMenuClose() }}
                      className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4 text-gray-500 font-bold" />
                      <span>Manage account</span>
                    </button>

                    <SignOutButton >
                      <button
                        onClick={handleProfileMenuClose}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4 text-gray-500" />
                        <span>Sign out</span>
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SignedIn>

        {/* Mobile User Profile Avatar & Dropdown - Signed In */}
        <SignedIn>
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2"
                aria-label="User profile menu"
                aria-expanded={mobileMenuOpen}
                aria-haspopup="true"
              >
                <Image
                  src={user ? user.imageUrl : ""}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  priority={false}
                  loading='lazy'
                />
              </button>

              {/* Mobile User Profile Dropdown Menu - Signed-In*/}
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={user ? user.imageUrl : ""}
                          alt="User avatar"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          priority={false}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{user?.firstName}</div>
                        <div className="text-xs text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* User Profile Dropdown Menu Items */}
                  <div className="py-1">
                    {pathname !== "/"
                      && <button
                        onClick={() => { router.push("/"); handleProfileMenuClose() }}
                        className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                        role="menuitem"
                      >
                        <Home className="w-4 h-4 text-gray-500 font-bold" />
                        <span>Home Page</span>
                      </button>}

                    {!isProtectedPath
                      && <button
                        onClick={() => { router.push("/tracker"); handleProfileMenuClose() }}
                        className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                        role="menuitem"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-500" />
                        <span>Tracker Dashboard</span>
                      </button>
                    }

                    <button
                      onClick={() => { router.push("/goal"); handleProfileMenuClose() }}
                      className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <Goal className="w-4 h-4 text-gray-500" />
                      <span>Set Goal</span>
                    </button>

                    <button
                      onClick={() => { router.push("/list"); handleProfileMenuClose() }}
                      className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <ListCheck className="w-4 h-4 text-gray-500 font-bold" />
                      <span>Your Listed Items</span>
                    </button>

                    <button
                      onClick={() => { router.push("/account"); handleProfileMenuClose() }}
                      className="border-b border-gray-200 w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span>Manage account</span>
                    </button>

                    <SignOutButton>
                      <button
                        onClick={handleProfileMenuClose}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4 text-gray-500" />
                        <span>Sign out</span>
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SignedIn>

      </div>

      {/* Mobile Default Menu Dropdown - Signed-Out */}
      {mobileMenuOpen && (
        <SignedOut>
          <div className="md:hidden bg-white border-t m-2 rounded-lg shadow-lg slide-in-from-top-2 duration-200" ref={mobileMenuRef}>
            <div className="container mx-auto px-4 pt-4 pb-5 flex flex-col space-y-4">
              <Link
                href="/"
                onNavigate={handleProfileMenuClose}
                className={cn(
                  "border-b border-gray-200 pb-3 text-sm font-medium transition-colors hover:text-dietGreen-400",
                  isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
                )}
                prefetch={true}
              >
                <div className="flex justify-start items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>Home Page</span>
                </div>
              </Link>

              <Link
                href="/calorie-calculator"
                onNavigate={handleProfileMenuClose}
                className={cn(
                  "border-b border-gray-200 pb-3 text-sm font-medium transition-colors hover:text-dietGreen-400",
                  isScrolled ? "text-dietBlue-700" : "text-dietBlue-700"
                )}
                prefetch={true}
              >
                <div className="flex justify-start items-center gap-2">
                  <Calculator className="w-4 h-4 text-gray-500" />
                  <span>Calorie Calculator</span>
                </div>
              </Link>

              <Link
                href="#features"
                className="border-b border-gray-200 pb-3 text-dietBlue-700 font-medium py-2"
                onNavigate={handleProfileMenuClose}
              >
                <div className="flex justify-start items-center gap-2">
                  <Cpu className="w-4 h-4 text-gray-500" />
                  <span>Features</span>
                </div>
              </Link>

              <Link
                href="#about"
                className="border-b border-gray-200 pb-3 text-dietBlue-700 font-medium py-2"
                onNavigate={handleProfileMenuClose}
              >
                <div className="flex justify-start items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span>About</span>
                </div>
              </Link>

              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="dietOutline" size="sm" onClick={() => { handleLogin(); handleProfileMenuClose(); }} className='mb-1'>
                  Login
                </Button>
                <Button variant="diet" size="sm" onClick={() => { router.push("/sign-up"); handleProfileMenuClose(); }}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </SignedOut>
      )}

    </header>
  );
}