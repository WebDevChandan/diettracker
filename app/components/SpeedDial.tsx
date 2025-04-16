'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import useDialog from '@/hooks/useDialog';
import { FoodItemType } from '@/types/FoodItem';
import { AllCategory } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Apple, Calculator, ListPlus, Plus } from 'lucide-react';
import * as React from 'react';
import ManageItemProvider from '../context/ManageItemProvider';
import ManageItem from './ManageItem';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDiet } from '../hooks/useDiet';
import TotalNutrients from './TotalNutrients';
import SpeedDialFoodItem from './SpeedDialFoodItem';

interface SpeedDialItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    index: number;
}

const SpeedDialItem = ({ icon, label, onClick, index }: SpeedDialItemProps) => (
    <TooltipProvider delayDuration={100}>
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -60 * (index + 1) }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="absolute bottom-0 right-0"
                >
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-xl bg-white border-slate-100 border-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                    >
                        {icon}
                    </Button>

                </motion.div>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

// Main Speed Dial Component
export function SpeedDial() {
    const { isAddNewItemDialog, setIsAddNewItemDialog, isListedDialog, setIsListedDialog, isTotalDialog, setIsTotalDialog } = useDialog();
    const [isDialOpen, setIsDialOpen] = React.useState(false);

    // Click outside & keyboard escape handling
    React.useEffect(() => {
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

    React.useEffect(() => {
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
            label: 'List Food Items',
            onClick: () => {
                setIsListedDialog(!isListedDialog)
                setIsAddNewItemDialog(!isAddNewItemDialog)
            },
        },
        {
            icon: <Calculator className="h-6 w-6" />,
            label: 'Total Nutrients',
            onClick: () => setIsTotalDialog(!isTotalDialog),
        },
    ];



    return (
        <div className="speed-dial-container fixed bottom-6 right-6 z-50">

            <SpeedDialFoodItem />

            <TotalNutrients />

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
    );
}
