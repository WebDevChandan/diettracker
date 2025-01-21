"use server";
import { DietType } from "@/types/Diet";
import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addItem = async ([newItem]: DietType) => {
    try {
        const categoryID = await prisma.category.findFirst({
            where: {
                name: newItem.category.name
            },
        });

        if (!categoryID) {
            return {
                error: `Category "${newItem.category.name}" not found.`,
            }
        }

        await prisma.foodItem.create({
            data: {
                name: newItem.name,
                calories: newItem.calories,
                protein: newItem.protein,
                fat: newItem.fat,
                carbs: newItem.carbs,
                sugar: newItem.sugar,
                amountPer: newItem.amountPer,
                categoryId: categoryID.id,
            }
        })

        revalidatePath("/");

        return {
            message: "Item added successfully",
        }
        
    } catch (error) {
        console.log(error);

        return {
            error: "Failed to add item",
        }
    }
}