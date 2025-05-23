"use client";
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { ReactNode, useEffect, useState } from "react";

type ResponsiveHint = {
    icon: ReactNode,
    label: string,
    content: ReactNode
}
export default function ResponsiveHint({ icon, label, content }: ResponsiveHint) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();

        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return (
        <>
            {isMobile
                ? <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                            {icon}
                            <span className="sr-only">{label}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="max-w-sm text-sm bg-primary text-primary-foreground px-3 py-1.5 shadow-none">
                        <p>
                            {content}
                        </p>
                    </PopoverContent>
                </Popover>
                : <TooltipProvider delayDuration={200} disableHoverableContent={true}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0" type="button">
                                {icon}
                                <span className="sr-only">{label}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                            <p>
                                {content}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }
        </>
    )
}
