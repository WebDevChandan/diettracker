import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="relative h-10 w-10">
                                <Image
                                    src="/assets/logo.svg"
                                    alt="DietTracker Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-dietBlue-700">
                                DietTracker
                            </span>
                        </Link>
                        <p className="text-gray-600 mb-4 text-sm">
                            AI-powered nutrition tracking to help you achieve your health and weight loss goals efficiently.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-500 hover:text-dietBlue-700 transition-colors">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-dietBlue-700 transition-colors">
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-dietBlue-700 transition-colors">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-dietBlue-700 transition-colors">
                                <Youtube size={20} />
                                <span className="sr-only">YouTube</span>
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold text-dietBlue-700 mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Features</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Integrations</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Updates</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-dietBlue-700 mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Team</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Blog</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-dietGreen-400 text-sm transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-dietBlue-700 mb-4">Stay Updated</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Subscribe to our newsletter for tips, updates, and exclusive offers.
                        </p>
                        <div className="flex space-x-2">
                            <Input
                                type="email"
                                placeholder="Your email address"
                                className="bg-white border-gray-200"
                                aria-label="Email address"
                            />
                            <Button variant="diet" size="icon" aria-label="Subscribe">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} DietTracker. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link href="#" className="text-gray-500 hover:text-dietBlue-700 text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-dietBlue-700 text-sm transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-dietBlue-700 text-sm transition-colors">
                            Cookies Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}