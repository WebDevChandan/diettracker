"use client";

import { Button } from "@/components/ui/button";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadItemProgress,
    FileUploadList,
    FileUploadTrigger,
    useFileUpload,
} from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useUploadFile } from "../hook/useUploadFile";

export function UploadImage({ className }: React.ComponentProps<"form">) {
    const { files, setFiles, isUploading } = useUploadFile();

    const onFileValidate = React.useCallback(
        (file: File): string | null => {
            // Validate max files
            if (files.length >= 1) {
                return "You can only upload up to 1 file";
            }

            // Validate file type (only images)
            if (!file.type.startsWith("image/")) {
                return "Only image files are allowed";
            }

            // Validate file size (max 20MB)
            const MAX_SIZE = 20 * 1024 * 1024; // 20MB
            if (file.size > MAX_SIZE) {
                return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
            }

            return null;
        },
        [files],
    );

    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    return (
        <>

            <FileUpload
                value={files}
                onValueChange={setFiles}
                onFileValidate={onFileValidate}
                onFileReject={onFileReject}
                // accept="image/*"
                maxFiles={2}
                className={cn("w-full max-w-md", className)}
                disabled={isUploading}
            >
                <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center rounded-full border p-2.5">
                            <Upload className="size-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">Drag & drop image here</p>
                        <p className="text-muted-foreground text-xs">
                            Or click to browse (max 1 image)
                        </p>
                    </div>
                    <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                            Browse image
                        </Button>
                    </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                    {files.map((file, index) => (
                        <FileUploadItem key={index} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                                <Button variant="ghost" size="icon" className="size-7">
                                    <X />
                                </Button>
                            </FileUploadItemDelete>
                            {/* <FileUploadItemProgress /> */}
                        </FileUploadItem>
                    ))}
                </FileUploadList>
            </FileUpload>
        </>
    );
}