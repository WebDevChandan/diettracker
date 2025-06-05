"use client";
import { AllCategory } from "@prisma/client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type addItemByCatType = {
    breakfast: boolean,
    lunch: boolean,
    dinner: boolean,
    snacks: boolean,
    other: boolean,
}
interface OtherDialogType {
    isListedDialog: boolean
    setIsListedDialog: Dispatch<SetStateAction<boolean>>
    isSummaryDialog: boolean
    setIsSummaryDialog: Dispatch<SetStateAction<boolean>>
    isUploadFileDialog: boolean
    setIsUploadFileDialog: Dispatch<SetStateAction<boolean>>
};

interface DialogContextType extends OtherDialogType {
    isAddNewItemDialog: boolean
    setIsAddNewItemDialog: Dispatch<SetStateAction<boolean>>
    isAddNewItemToCatDialog: addItemByCatType
    setIsAddNewItemToCatDialog: Dispatch<SetStateAction<addItemByCatType>>
};

export const DialogContext = createContext<DialogContextType>({
    isAddNewItemDialog: false,
    setIsAddNewItemDialog: () => { },
    isListedDialog: false,
    setIsListedDialog: () => { },
    isSummaryDialog: false,
    setIsSummaryDialog: () => { },
    isUploadFileDialog: false,
    setIsUploadFileDialog: () => { },
    isAddNewItemToCatDialog: {
        breakfast: false,
        lunch: false,
        dinner: false,
        other: false,
        snacks: false,
    },
    setIsAddNewItemToCatDialog: () => { },
});

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [isAddNewItemDialog, setIsAddNewItemDialog] = useState<boolean>(false);
    const [isListedDialog, setIsListedDialog] = useState(false);
    const [isSummaryDialog, setIsSummaryDialog] = useState(false);
    const [isUploadFileDialog, setIsUploadFileDialog] = useState(false);
    const [isAddNewItemToCatDialog, setIsAddNewItemToCatDialog] = useState<addItemByCatType>({
        breakfast: false,
        lunch: false,
        dinner: false,
        snacks: false,
        other: false,
    });

    return (
        <DialogContext.Provider value={{
            isAddNewItemDialog,
            setIsAddNewItemDialog,
            isListedDialog,
            setIsListedDialog,
            isSummaryDialog,
            setIsSummaryDialog,
            isUploadFileDialog,
            setIsUploadFileDialog,
            isAddNewItemToCatDialog,
            setIsAddNewItemToCatDialog

        }}>
            {children}
        </DialogContext.Provider >
    )
}
