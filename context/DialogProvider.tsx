"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type DialogContextType = {
    isDialogOpen: boolean
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
};

export const DialogContext = createContext<DialogContextType>({
    isDialogOpen: false,
    setIsDialogOpen: () => { },
});

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <DialogContext.Provider value={{
            isDialogOpen,
            setIsDialogOpen
        }}>
            {children}
        </DialogContext.Provider >
    )
}
