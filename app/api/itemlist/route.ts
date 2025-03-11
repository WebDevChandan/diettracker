import { fetchUserId } from "@/utils/fetchUserId";
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        if (request.method !== "GET") {
            return NextResponse.json(
                { error: "Method Not Allowed" },
                { status: 405 },
            )
        }

        const searchParams = request.nextUrl.searchParams;
        const foodName = searchParams.get('search');

        if (!foodName)
            throw new Error(`Food name not found`);

        const userId = await fetchUserId();

        if (!userId)
            throw new Error(`UserID not found`);

        const userListedItems = await prisma.foodItemList.findMany(({
            where: {
                user_id: userId,
                name: {
                    contains: foodName,
                    mode: "insensitive",
                }
            },
            select: {
                id: true,
                name: true,
                calories: true,
                amountPer: true,
                protein: true,
                carbs: true,
                fat: true,
                sugar: true,
                category: true,
                currentWeight: true,
                listed: true,
            },
            distinct: ['name'],
        }));


        return NextResponse.json(
            { data: userListedItems },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 503 },
        )
    }
}