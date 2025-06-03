"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface OtherDialogType {
    isListedDialog: boolean
    setIsListedDialog: Dispatch<SetStateAction<boolean>>
    isTotalDialog: boolean
    setIsTotalDialog: Dispatch<SetStateAction<boolean>>
    isUploadFileDialog: boolean
    setIsUploadFileDialog: Dispatch<SetStateAction<boolean>>
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
    isUploadFileDialog: false,
    setIsUploadFileDialog: () => { },
});

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [isAddNewItemDialog, setIsAddNewItemDialog] = useState<boolean>(false);
    const [isListedDialog, setIsListedDialog] = useState(false);
    const [isTotalDialog, setIsTotalDialog] = useState(false);
    const [isUploadFileDialog, setIsUploadFileDialog] = useState(false);

    return (
        <DialogContext.Provider value={{
            isAddNewItemDialog,
            setIsAddNewItemDialog,
            isListedDialog,
            setIsListedDialog,
            isTotalDialog,
            setIsTotalDialog,
            isUploadFileDialog,
            setIsUploadFileDialog
        }}>
            {children}
        </DialogContext.Provider >
    )
}
