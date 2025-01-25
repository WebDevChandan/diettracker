import { useContext } from "react";
import { ManageItemContext } from "../context/ManageItemProvider";

export function useManageItemAction() {
    const { foodItem, setFoodItem } = useContext(ManageItemContext);

    if (!foodItem) {
        throw new Error("useItemAction must be used within a ManageItemProvider");
    }

    return {
        foodItem,
        setFoodItem,
    }
}