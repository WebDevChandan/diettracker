"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type DialogContextType = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
};

export const DialogContext = createContext<DialogContextType>({
    open: false,
    setOpen: () => { },
});

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <DialogContext.Provider value={{
            open,
            setOpen
        }}>
            {children}
        </DialogContext.Provider >
    )
}
