import { useContext } from "react";
import { UploadFileContext } from "../context/UploadFileProvider";

export const useUploadFile = () => {
    const context = useContext(UploadFileContext);
    if (!context) {
        throw new Error("useUploadFile must be used within a UploadFileProvider");
    }
    return context;
};