'use client'

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-6 text-center">
                We apologize for the inconvenience. Please try again.
            </p>
            <Button
                onClick={reset}
                className="bg-primary hover:bg-primary/90"
            >
                Try again
            </Button>
        </div>
    )
}