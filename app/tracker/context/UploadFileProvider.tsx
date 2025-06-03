"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type UploadFileContextType = {
    files: File[],
    setFiles: Dispatch<SetStateAction<File[]>>,
    isUploading: boolean,
    setIsUploading: Dispatch<SetStateAction<boolean>>,
};

export const UploadFileContext = createContext<UploadFileContextType>({
    files: [],
    setFiles: () => { },
    isUploading: false,
    setIsUploading: () => { },
});

export default function UploadFileProvider({ children }: { children: ReactNode }) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    return (
        <UploadFileContext.Provider value={{
            files,
            setFiles,
            isUploading,
            setIsUploading
        }}>
            {children}
        </UploadFileContext.Provider>
    )
}
