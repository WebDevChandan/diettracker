import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        if (request.method !== "GET") {
            return NextResponse.json(
                { error: "Method Not Allowed" },
                { status: 405 },
            )
        }

        await prisma.foodItem.deleteMany();
        await prisma.category.deleteMany();


        await prisma.category.createMany({
            data: [
                { name: "breakfast" },
                { name: "lunch" },
                { name: "dinner" },
                { name: "snacks" },
                { name: "other" },
            ],
        })

        const breakfastId = await prisma.category.findFirst({
            where: { name: "breakfast" },
        });
        const lunchId = await prisma.category.findFirst({
            where: { name: "lunch" },
        });

        await prisma.foodItem.createMany({
            data: [{
                name: "Apple",
                calories: 50,
                protein: 2,
                carbs: 2,
                fat: 0.1,
                sugar: 0,
                amountPer: 100,
                categoryId: breakfastId!.id,
            }, {
                name: 'Baked Salmon',
                calories: 378,
                protein: 21,
                fat: 22.4,
                carbs: 12,
                sugar: 0,
                amountPer: 100,
                categoryId: lunchId!.id,
            }]
        });

        return NextResponse.json(
            { message: "Database Seeded Successfully" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 503 },
        )
    }
}