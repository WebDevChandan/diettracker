"use client";
import { signUploadFile } from "@/app/server/cloudinary.config";
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
    FileUploadProps,
    FileUploadTrigger
} from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useUploadFile } from "../hook/useUploadFile";
import { Input } from "@/components/ui/input";

export function UploadImage({ className }: React.ComponentProps<"form">) {
    const { files, setFiles, isUploading, setIsUploading, setCloudStoredFile } = useUploadFile();
    const { user } = useUser();
    const abortController = React.useRef(new AbortController());

    React.useEffect(() => {
        if (!files.length)
            abortController.current.abort();
    }, [files.length])

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

    const pauseUploadingFile = () => {
        abortController.current.abort();
    }

    const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
        async (files, { onProgress }) => {
            if (abortController.current)
                abortController.current = new AbortController();

            try {
                setIsUploading(true);

                const cloudName = "dnwf21zlv";
                const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                const file = files[0];
                const imageFileName = file.name.match(/^([^\.]+)/)?.[0] ?? null;;
                const folder = `diettracker/${user?.id ?? "unknownUser"}`
                const upload_preset = 'my_pdf_preset';
                const file_metadata = `alt=${imageFileName}`;

                const signResponse = await signUploadFile(folder, upload_preset, file_metadata);

                const formData = new FormData();

                formData.append("file", file);
                formData.append('folder', folder);
                formData.append("upload_preset", upload_preset);
                formData.append('context', file_metadata);
                formData.append("cloud_name", cloudName);
                formData.append('api_key', `${signResponse.apiKey}`);
                formData.append('signature', `${signResponse.signature}`);
                formData.append('timestamp', `${signResponse.timestamp}`);

                const { secure_url, resource_type, format } = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    signal: abortController.current.signal,
                    onUploadProgress: (event) => {
                        if (event.total) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            onProgress(file, progress);
                        }
                    },
                }).then(res => res.data);

                if (secure_url)
                    setCloudStoredFile({
                        secure_url: secure_url,
                        type: `${resource_type}/${format}`
                    });

            } catch (error) {
                setIsUploading(false);

                toast.error(
                    error instanceof Error ? error.message : "An unknown error occurred",
                );
            } finally {
                setIsUploading(false);
            }
        },
        [],
    );

    return (
        <>
            <FileUpload
                value={files}
                onValueChange={setFiles}
                onFileValidate={onFileValidate}
                onFileReject={onFileReject}
                accept="image/*,application/pdf,application/msword"
                onUpload={onUpload}
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
                            <div className="flex w-full items-center gap-2">
                                <FileUploadItemPreview />
                                <FileUploadItemMetadata />
                                <FileUploadItemDelete asChild>
                                    <Button variant="ghost" size="icon" className="size-7" onClick={pauseUploadingFile}>
                                        <X />
                                    </Button>
                                </FileUploadItemDelete>
                            </div>
                            <FileUploadItemProgress />
                        </FileUploadItem>
                    ))}
                </FileUploadList>
            </FileUpload>
        </>
    );
}