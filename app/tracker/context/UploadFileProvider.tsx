"use client";
import { CloudStoredFileType } from "@/types/CloudStoredFileURL";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type UploadFileContextType = {
    files: File[],
    setFiles: Dispatch<SetStateAction<File[]>>,
    isUploading: boolean,
    setIsUploading: Dispatch<SetStateAction<boolean>>,
    cloudStoredFile: CloudStoredFileType,
    setCloudStoredFile: Dispatch<SetStateAction<CloudStoredFileType>>,
};

export const UploadFileContext = createContext<UploadFileContextType>({
    files: [],
    setFiles: () => { },
    isUploading: false,
    setIsUploading: () => { },
    cloudStoredFile: {
        secure_url: "",
        type: "",
    },
    setCloudStoredFile: () => { },
});

export default function UploadFileProvider({ children }: { children: ReactNode }) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [cloudStoredFile, setCloudStoredFile] = useState<CloudStoredFileType>({
        secure_url: "",
        type: "",
    });

    return (
        <UploadFileContext.Provider value={{
            files,
            setFiles,
            isUploading,
            setIsUploading,
            cloudStoredFile,
            setCloudStoredFile
        }}>
            {children}
        </UploadFileContext.Provider>
    )
}
