"use server";
import { DietType } from "@/types/Diet";
import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const addItem = async ([newItem]: DietType) => {
    try {
        if (!newItem.category.name)
            throw new Error(`Invalid item category`);

        const categoryID = await prisma.category.findFirst({
            where: {
                name: newItem.category.name
            },
        });

        if (!categoryID)
            throw new Error(`Invalid item category`);

        const isDuplicateItem = await prisma.foodItem.findFirst({
            where: {
                name: newItem.name,
                categoryId: categoryID.id,
            },
            select: {
                name: true,
            }
        })

        if (isDuplicateItem)
            throw new Error(`Duplicate item found`);

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

    } catch (error: any) {
        throw new Error(error.message || `Failed to add item`);
    }
}