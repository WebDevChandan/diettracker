"use client";

import React, { useEffect } from 'react';

interface ScrollAnimationProviderProps {
    children: React.ReactNode;
}

export function ScrollAnimationProvider({ children }: ScrollAnimationProviderProps) {
    useEffect(() => {
        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        };

        const observer = new IntersectionObserver(callback, {
            threshold: 0.1
        });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => observer.observe(element));

        return () => {
            elements.forEach(element => observer.unobserve(element));
        };
    }, []);

    return <>{children}</>;
}