"use client";

import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Database, UserCheck, ChartBar, Camera, MessageSquareText, Utensils, ArrowUpDown } from 'lucide-react';
import { useInView } from 'framer-motion';

const features = [
    {
        icon: <Brain className="h-10 w-10 text-dietGreen-400" />,
        title: "AI-Powered Analysis",
        description: "Advanced nutrition analysis using Google Gemini 2.0 flash and Vertex AI Studio for accurate tracking."
    },
    {
        icon: <Database className="h-10 w-10 text-dietGreen-400" />,
        title: "USDA Database",
        description: "Access comprehensive nutritional information from the USDA datasets for thousands of food items."
    },
    {
        icon: <UserCheck className="h-10 w-10 text-dietGreen-400" />,
        title: "Personal Goals",
        description: "Set personalized goals based on your age, weight, height, BMR, and TDEE calculations."
    },
    {
        icon: <Utensils className="h-10 w-10 text-dietGreen-400" />,
        title: "Meal Categorization",
        description: "Organize food items by category: Breakfast, Lunch, Dinner, Snacks, and more for better tracking."
    },
    {
        icon: <ChartBar className="h-10 w-10 text-dietGreen-400" />,
        title: "Nutrient Monitoring",
        description: "Track macros and micros with our AG Grid-based tracker for detailed nutritional insights."
    },
    {
        icon: <Camera className="h-10 w-10 text-dietGreen-400" />,
        title: "Image Recognition",
        description: "Upload images or use your camera to scan nutritional labels for quick and easy entry."
    },
    {
        icon: <MessageSquareText className="h-10 w-10 text-dietGreen-400" />,
        title: "AI Chat Support",
        description: "Get nutritional guidance and form assistance through our intelligent chat support."
    },
    {
        icon: <ArrowUpDown className="h-10 w-10 text-dietGreen-400" />,
        title: "Deficit Tracking",
        description: "Monitor your calorie deficit to ensure effective fat loss during your weight loss journey."
    }
];

export function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true});

    return (
        <section
            id="features"
            className="py-20 bg-white"
            ref={sectionRef}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-dietBlue-700 mb-4">
                        Powerful Features for Your Nutrition Journey
                    </h2>
                    <p className="text-lg text-gray-600">
                        Our comprehensive suite of tools designed to make nutrition tracking effective, accurate, and simple.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="feature-card border-gray-100 hover:border-dietGreen-400/50"
                            style={{
                                opacity: isInView ? 1 : 0,
                                transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                                transitionDelay: `${0.1 + (index * 0.1)}s`
                            }}
                        >
                            <CardHeader>
                                <div className="mb-2">{feature.icon}</div>
                                <CardTitle className="text-xl text-dietBlue-700">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-600 text-sm">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}