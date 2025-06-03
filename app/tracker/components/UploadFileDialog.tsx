"use client"

import useDialog from "@/app/hooks/useDialog"
import { useMediaQuery } from "@/app/hooks/useMediaQuery"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import * as React from "react"
import { toast } from "sonner"
import { useDiet } from "../hook/useDiet"
import { useUploadFile } from "../hook/useUploadFile"
import { UploadImage } from "./UploadImage"
import { imageProcessingAction } from "../server/imageProcessing.action"

export function UploadFileDialog() {
    const { files, isUploading, setIsUploading } = useUploadFile();
    const { isUploadFileDialog, setIsUploadFileDialog } = useDialog();
    const { newFoodItem, setNewFoodItem } = useDiet();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const processImage = async () => {
        if (!files.length) return;

        try {
            setIsUploading(true);

            const result = await imageProcessingAction(files[0]);

            if (result.status !== 200) {
                toast.error(result.errorMessage || "Failed to process image");

            } else if (result.status === 200 && result.data) {
                setNewFoodItem({
                    ...newFoodItem,
                    calories: result.data.calories,
                    protein: result.data.protein,
                    carbs: result.data.carbs,
                    fat: result.data.fat,
                    sugar: result.data.sugar,
                    amountPer: result.data.amountPer,
                });

                toast.success(result.message);

                setIsUploadFileDialog(false);
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to process image");

        } finally {
            setIsUploading(false);
        }
    }

    if (isDesktop) {
        return (
            <Dialog open={isUploadFileDialog} onOpenChange={setIsUploadFileDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>AI Nutrition Label Analyzer </DialogTitle>
                        <DialogDescription>
                            Upload a clear photo of the product&apos;s nutrition label by browsing an image to include this item in your diet.
                        </DialogDescription>
                    </DialogHeader>
                    <UploadImage />
                    <DialogFooter className="pt-2">
                        <Button
                            variant="default"
                            disabled={!files.length || isUploading}
                            onClick={processImage}>
                            {isUploading && <Spinner size="medium" show={true} />} Analyze Nutrition
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isUploadFileDialog} onOpenChange={setIsUploadFileDialog}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>AI Nutrition Label Analyzer</DrawerTitle>
                    <DrawerDescription>
                        Upload a clear photo of the product&apos;s nutrition label by using your camera or browsing an image to include this item in your diet.
                    </DrawerDescription>
                </DrawerHeader>
                <UploadImage className="px-4" />
                <DrawerFooter className="pt-2">
                    <Button
                        variant="default"
                        disabled={!files.length || isUploading}
                        onClick={processImage}>
                        {isUploading && <Spinner size="small" show={isUploading} />} Analyze Nutrition
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}