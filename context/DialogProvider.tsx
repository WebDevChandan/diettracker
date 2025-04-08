"use client";
import { Dialog } from "@/components/ui/dialog";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

interface MultiSelectorType {
    isMultiSelector: boolean
    setIsMultiSelector: Dispatch<SetStateAction<boolean>>
};

interface DialogContextType extends MultiSelectorType {
    isDialogOpen: boolean
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
};

export const DialogContext = createContext<DialogContextType>({
    isDialogOpen: false,
    setIsDialogOpen: () => { },
    isMultiSelector: false,
    setIsMultiSelector: () => { },
});

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isMultiSelector, setIsMultiSelector] = useState<boolean>(false);

    useEffect(() => {
        if (!isDialogOpen) {
            setIsMultiSelector(false);
        }

    }, [isDialogOpen])
    return (
        <DialogContext.Provider value={{
            isDialogOpen,
            setIsDialogOpen,
            isMultiSelector,
            setIsMultiSelector
        }}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {children}
            </Dialog>
        </DialogContext.Provider >
    )
}
