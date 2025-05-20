"use client";
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export function CtaSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true });
    const router = useRouter();


    return (
        <section
            ref={sectionRef}
            className="py-20 bg-dietBlue-700 relative overflow-hidden"
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-dietGreen-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-dietGreen-400/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div
                    className="max-w-3xl mx-auto text-center"
                    style={{
                        opacity: isInView ? 1 : 0,
                        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                    }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Start Your Journey to Better Nutrition Today
                    </h2>
                    <p className="text-lg text-gray-100 mb-8 max-w-xl mx-auto">
                        Join thousands of users who have transformed their approach to nutrition and achieved their weight loss goals with DietTracker.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <SignedOut>
                            <Button variant="diet" size="xl" className="group" onClick={() => router.push("/sign-up")}>
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button variant="outline" size="xl" className="bg-transparent border-white text-white hover:bg-white/10">
                                View Plans
                            </Button>
                        </SignedOut>

                        <SignedIn>
                            <Button variant="diet" size="xl" className="group" onClick={() => router.push("/tracker")}>
                                Start Tracking
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </SignedIn>
                    </div>

                    <p className="text-gray-300 mt-6 text-sm">
                        No credit card required. Start with our free plan today.
                    </p>
                </div>
            </div>
        </section>
    );
}