"use server";
import { FoodItemType } from "@/types/FoodItem";
import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

const _getCategoryID = async (categoryName: AllCategory) => {
    console.log("getCategoryID", categoryName);
    const isCategoryID = await prisma.category.findFirst({
        where: {
            name: categoryName
        },
    });

    if (!isCategoryID)
        throw new Error(`Invalid item category`);

    return isCategoryID.id;

}

export const addFoodItem = async (newItem: FoodItemType) => {
    try {
        if (!newItem.category.name)
            throw new Error(`Invalid item category`);

        const categoryID = await _getCategoryID(newItem.category.name);

        const isDuplicateItem = await prisma.foodItem.findFirst({
            where: {
                name: newItem.name,
                categoryId: categoryID,
            },
            select: {
                name: true,
            }
        })

        if (isDuplicateItem)
            throw new Error(`Duplicate item found`);

        const createdItem = await prisma.foodItem.create({
            data: {
                name: newItem.name,
                calories: newItem.calories,
                protein: newItem.protein,
                fat: newItem.fat,
                carbs: newItem.carbs,
                sugar: newItem.sugar,
                amountPer: newItem.amountPer,
                categoryId: categoryID,
            }
        })

        revalidatePath("/");

        return {
            message: "Item added successfully",
            newItemId: createdItem.id,
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item`);
    }
}

export const updateFoodItem = async (editItem: FoodItemType) => {
    try {
        if (!editItem.id)
            throw new Error(`Item ID not Found`);

        const categoryID = await _getCategoryID(editItem.category.name);

        await prisma.foodItem.update({
            where: {
                id: editItem.id,
            },
            data: {
                name: editItem.name,
                currentWeight: editItem.currentWeight,
                calories: editItem.calories,
                protein: editItem.protein,
                fat: editItem.fat,
                carbs: editItem.carbs,
                sugar: editItem.sugar,
                amountPer: editItem.amountPer,
                categoryId: categoryID,
            }
        })

        revalidatePath("/");

        return {
            message: "Item updated successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to update item`);
    }
}

export const deleteFoodItem = async (deleteItem: FoodItemType) => {
    try {
        if (!deleteItem.id)
            throw new Error(`Item ID not Found`);

        await prisma.foodItem.delete({
            where: {
                id: deleteItem.id,
            },
        })

        revalidatePath("/");

        return {
            message: "Item deleted successfully",
        }

    } catch (error: any) {
        throw new Error(error.message || `Failed to delete item`);
    }
}