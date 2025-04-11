import { AllCategory } from "@prisma/client";
import { useContext } from "react";
import { DietContext } from "../context/DietProvider";

export function useDiet() {
    const { diet, setDiet, total, setTotal } = useContext(DietContext);

    if (!diet) {
        throw new Error("useDiet must be used within a DietProvider");
    }

    const breakfast = diet.filter(item => item.category.includes(AllCategory.breakfast));
    const lunch = diet.filter(item => item.category.includes(AllCategory.lunch));
    const dinner = diet.filter(item => item.category.includes(AllCategory.dinner));
    const snacks = diet.filter(item => item.category.includes(AllCategory.snacks));
    const other = diet.filter(item => item.category.includes(AllCategory.other));


    return {
        breakfast,
        lunch,
        dinner,
        diet,
        setDiet,
        total,
        setTotal
    };
}