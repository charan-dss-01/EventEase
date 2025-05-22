"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, X } from 'lucide-react';
 
function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isDashboard = pathname === '/dashboard';

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsSidebarOpen(false);
    };

    // Don't render navbar on dashboard
    if (isDashboard) {
        return null;
    }

    const NavLinks = () => (
        <>
                        <SignedOut>
                            {isHome && (
                                <>
                                    <div onClick={() => scrollToSection('home')}>
                                        <MenuItem setActive={setActive} active={active} item="Home" />
                                    </div>
                                    <div onClick={() => scrollToSection('features')}>
                                        <MenuItem setActive={setActive} active={active} item="Features" />
                                    </div>
                                    <div onClick={() => scrollToSection('testimonials')}>
                                        <MenuItem setActive={setActive} active={active} item="Testimonials" />
                                    </div>
                                    <div onClick={() => scrollToSection('contact')}>
                                        <MenuItem setActive={setActive} active={active} item="Contact" />
                                    </div>
                                </>
                            )}
                        </SignedOut>
                        
                        <SignedIn>
                            <Link href="/">
                                <MenuItem setActive={setActive} active={active} item="Home" />
                            </Link>
                            <Link href="/all-events">
                                <MenuItem setActive={setActive} active={active} item="Events" />
                            </Link>
                            <Link href="/technical-events">
                                <MenuItem setActive={setActive} active={active} item="Technical Events" />
                            </Link>
                            <Link href="/non-technical-events">
                                <MenuItem setActive={setActive} active={active} item="Non-Technical Events" />
                            </Link>
                            <Link href="/dashboard">
                                <MenuItem setActive={setActive} active={active} item="Dashboard" />
                            </Link>
                        </SignedIn>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="fixed top-4 right-4 z-50 md:hidden">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                >
                    {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
            </div>

            {/* Desktop Navbar */}
            <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-40 hidden md:block", className)}>
                <Menu setActive={setActive}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                            <NavLinks />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="border border-transparent bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-padding hover:from-purple-500 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </Menu>
        </div>

            {/* Mobile Sidebar */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-64 bg-white/10 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out md:hidden",
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col p-6 space-y-4">
                    <NavLinks />
                    <div className="flex flex-col gap-3 mt-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="w-full border border-transparent bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-padding hover:from-purple-500 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex justify-center">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
