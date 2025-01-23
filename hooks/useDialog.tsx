import { DialogContext } from "@/context/DialogProvider"
import { useContext } from "react"

export default function useDialog() {
    const context = useContext(DialogContext);

    if (!context)
        throw new Error("DialogContext not found");

    return (
        context
    )
}
