'use client';
import useDialog from '@/app/hooks/useDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Apple, ChartNoAxesCombined, Goal, ListPlus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dialerBG from '../styles/SpeedDial.module.css';
import NutrientSummary from './NutrientSummary';
import SpeedDialFoodItem from './SpeedDialFoodItem';

interface SpeedDialItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    index: number;
}

const SpeedDialItem = ({ icon, label, onClick, index }: SpeedDialItemProps) => (
    <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: -60 * (index + 1) }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        className="absolute bottom-0 right-0 w-screen"
    >
        <div className='flex justify-center items-center gap-2 z-10 float-right'>
            <Badge >{label}</Badge>
            <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full shadow-xl bg-white border-slate-100 border-1 text-secondary-foreground hover:text-primary-foreground"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                {icon}
            </Button>
        </div>

    </motion.div>
);

// Main Speed Dial Component
export function SpeedDial() {
    const { isAddNewItemDialog, setIsAddNewItemDialog, isListedDialog, setIsListedDialog, isTotalDialog, setIsTotalDialog } = useDialog();
    const [isDialOpen, setIsDialOpen] = useState(false);
    const router = useRouter();

    // Click outside & keyboard escape handling
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!document.querySelector('.speed-dial-container')?.contains(event.target as Node)) {
                setIsDialOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsDialOpen(false);
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (isListedDialog && !isAddNewItemDialog)
            setIsListedDialog(false)
    }, [isListedDialog, isAddNewItemDialog])

    const toggleSpeedDial = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDialOpen((prev) => !prev);
    };

    const speedDialItems = [
        {
            icon: <Apple className="h-6 w-6" />,
            label: 'Add New Item',
            onClick: () => {
                setIsListedDialog(false)
                setIsAddNewItemDialog(!isAddNewItemDialog)
            }
        },
        {
            icon: <ListPlus className="h-6 w-6" />,
            label: 'List Food Item',
            onClick: () => {
                setIsListedDialog(!isListedDialog)
                setIsAddNewItemDialog(!isAddNewItemDialog)
            },
        },
        {
            icon: <Goal className="h-6 w-6" />,
            label: 'Set Goal',
            onClick: () => router.push('/goal'),
        },
        {
            icon: <ChartNoAxesCombined className="h-6 w-6" />,
            label: 'Nutrient Summary',
            onClick: () => setIsTotalDialog(!isTotalDialog),
        },
    ];

    return (
        <>
            <div className="speed-dial-container fixed bottom-6 right-6 z-50">

                <SpeedDialFoodItem />

                <NutrientSummary />

                <AnimatePresence>
                    {isDialOpen && (
                        <div className="absolute bottom-2 right-1 pointer-events-none">
                            <div className="pointer-events-auto">
                                {speedDialItems.map((item, index) => (
                                    <SpeedDialItem
                                        key={item.label}
                                        icon={item.icon}
                                        label={item.label}
                                        onClick={() => {
                                            setIsDialOpen(false);
                                            item.onClick();
                                        }}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                <motion.div
                    animate={{ rotate: isDialOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                >
                    <Button
                        variant="default"
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-xl"
                        onClick={toggleSpeedDial}
                        aria-expanded={isDialOpen}
                        aria-label={isDialOpen ? 'Close menu' : 'Open menu'}
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </motion.div>
            </div>

            <div className={isDialOpen ? dialerBG.show : dialerBG.hide}></div>
        </>
    );
}
