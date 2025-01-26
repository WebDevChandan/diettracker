import { useContext, useEffect } from "react";
import { DietContext } from "../context/DietProvider";
import { AllCategory } from "@prisma/client";

export function useDiet() {
    const { diet, setDiet, initialDietState, setInitialDietState } = useContext(DietContext);

    if (!diet) {
        throw new Error("useDiet must be used within a DietProvider");
    }

    const breakfast = diet.filter(item => item.category.name === AllCategory.breakfast);
    const lunch = diet.filter(item => item.category.name === AllCategory.lunch);
    const dinner = diet.filter(item => item.category.name === AllCategory.dinner);
    const snacks = diet.filter(item => item.category.name === AllCategory.snacks);
    const other = diet.filter(item => item.category.name === AllCategory.other);

    return {
        breakfast,
        diet,
        setDiet,
        initialDietState,
        setInitialDietState
    };
}