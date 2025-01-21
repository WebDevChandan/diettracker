import { useContext } from "react";
import { DietContext } from "../context/DietProvider";

export function useDiet() {
    const context = useContext(DietContext);
    if (!context) {
        throw new Error("useDiet must be used within a DietProvider");
    }
    
    return context;
}