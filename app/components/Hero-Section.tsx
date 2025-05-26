"use client";
import { Button } from '@/components/ui/button';
import { useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useCarousel } from '../hooks/useCarousel';
import { SignedIn, SignedOut } from '@clerk/nextjs';

const heroImages = [
    "https://images.pexels.com/photos/3621181/pexels-photo-3621181.jpeg",
    "https://images.pexels.com/photos/31555273/pexels-photo-31555273/free-photo-of-person-weighing-green-apple-on-electronic-scale.jpeg",
    "https://images.pexels.com/photos/6252678/pexels-photo-6252678.jpeg",
    "https://images.pexels.com/photos/2529371/pexels-photo-2529371.jpeg",
    "https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg",
    "https://images.pexels.com/photos/2331055/pexels-photo-2331055.jpeg",
];

export function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true });
    const { currentIndex, currentItem } = useCarousel(heroImages, 5000);
    const router = useRouter();

    return (
        <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div
                    ref={heroRef}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                    {/* Hero Text Content */}
                    <div
                        className="space-y-6"
                        style={{
                            opacity: isInView ? 1 : 0,
                            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                            transitionDelay: '0.1s'
                        }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-dietBlue-700 leading-tight">
                            Smart Nutrition <span className="text-dietGreen-400">Tracking</span> for Your Weight Loss Journey
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                            AI-powered nutrition tracking that helps you achieve your weight loss goals through precise calorie and nutrient monitoring.
                        </p>

                        {/* Key Benefits */}
                        <div className="space-y-3 py-2">
                            {[
                                'AI-powered nutrition analysis with Google Gemini 2.0',
                                'USDA database integration for accurate nutrition info',
                                'Personalized goal setting based on BMR and TDEE',
                                'Image scanning for quick nutritional label input'
                            ].map((benefit, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-2"
                                    style={{
                                        opacity: isInView ? 1 : 0,
                                        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                                        transitionDelay: `${0.3 + (i * 0.1)}s`
                                    }}
                                >
                                    <Check className="h-5 w-5 flex-shrink-0 text-dietGreen-400" />
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                            style={{
                                opacity: isInView ? 1 : 0,
                                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                                transitionDelay: '0.7s'
                            }}
                        >
                            <SignedOut>
                                <Button variant="diet" size="xl" className="group" onClick={() => router.push('/sign-up')}>
                                    Start Your Journey
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </SignedOut>
                            <SignedIn>
                                <Button variant="diet" size="xl" className="group" onClick={() => router.push('/tracker')}>
                                    Track Your Journey
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </SignedIn>
                            <Button variant="dietOutline" size="xl" onClick={() => router.push("/calorie-calculator")}>
                                Calculate Calorie
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image Carousel */}
                    <div
                        className="relative w-full h-[400px] md:h-[500px]"
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: 'opacity 0.8s ease-out',
                            transitionDelay: '0.5s',
                        }}
                    >
                        <div className="w-full h-full relative z-8 bg-white rounded-xl shadow-xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                            {heroImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="absolute inset-0 transition-opacity duration-1000"
                                    style={{
                                        opacity: currentIndex === index ? 1 : 0,
                                        zIndex: currentIndex === index ? 1 : 0,
                                    }}
                                >
                                    <Image
                                        src={image}
                                        alt={`Healthy lifestyle and nutrition tracking ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority={index === 0}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-dietBlue-700/20 to-transparent"></div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-dietGreen-400/20 rounded-full z-0" />
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-dietBlue-700/10 rounded-full z-0" />
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/3 right-0 w-64 h-64 bg-dietGreen-400/5 rounded-full blur-3xl -z-8" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-dietBlue-700/5 rounded-full blur-3xl -z-8" />
        </section >
    );
}