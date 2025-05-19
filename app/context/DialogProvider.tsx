"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface OtherDialogType {
    isListedDialog: boolean
    setIsListedDialog: Dispatch<SetStateAction<boolean>>
    isTotalDialog: boolean
    setIsTotalDialog: Dispatch<SetStateAction<boolean>>
};

interface DialogContextType extends OtherDialogType {
    isAddNewItemDialog: boolean
    setIsAddNewItemDialog: Dispatch<SetStateAction<boolean>>
};

export const DialogContext = createContext<DialogContextType>({
    isAddNewItemDialog: false,
    setIsAddNewItemDialog: () => { },
    isListedDialog: false,
    setIsListedDialog: () => { },
    isTotalDialog: false,
    setIsTotalDialog: () => { },
});

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [isAddNewItemDialog, setIsAddNewItemDialog] = useState<boolean>(false);
    const [isListedDialog, setIsListedDialog] = useState(false);
    const [isTotalDialog, setIsTotalDialog] = useState(false);

    return (
        <DialogContext.Provider value={{
            isAddNewItemDialog,
            setIsAddNewItemDialog,
            isListedDialog,
            setIsListedDialog,
            isTotalDialog,
            setIsTotalDialog
        }}>
            {children}
        </DialogContext.Provider >
    )
}
