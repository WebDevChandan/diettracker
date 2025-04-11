"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface MultiSelectorType {
    isListedDialog: boolean
    setIsListedDialog: Dispatch<SetStateAction<boolean>>
};

interface DialogContextType extends MultiSelectorType {
    isDialogOpen: boolean
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
};

export const DialogContext = createContext<DialogContextType>({
    isDialogOpen: false,
    setIsDialogOpen: () => { },
    isListedDialog: false,
    setIsListedDialog: () => { },
});

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isListedDialog, setIsListedDialog] = useState(false);

    return (
        <DialogContext.Provider value={{
            isDialogOpen,
            setIsDialogOpen,
            isListedDialog,
            setIsListedDialog
        }}>
            {children}
        </DialogContext.Provider >
    )
}
