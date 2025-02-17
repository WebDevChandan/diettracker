import prisma from "@/utils/prisma";
import { AllCategory } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        if (request.method !== "GET") {
            return NextResponse.json(
                { error: "Method Not Allowed" },
                { status: 405 },
            )
        }

        // await prisma.foodItem.deleteMany();
        // await prisma.category.deleteMany();


        // await prisma.category.createMany({
        //     data: [
        //         { name: "breakfast" },
        //         { name: "lunch" },
        //         { name: "dinner" },
        //         { name: "snacks" },
        //         { name: "other" },
        //     ],
        // })

        // const breakfastId = await prisma.category.findFirst({
        //     where: { name: "breakfast" },
        // });
        // const lunchId = await prisma.category.findFirst({
        //     where: { name: "lunch" },
        // });

        // await prisma.foodItem.createMany({
        //     data: [{
        //         name: "Apple",
        //         calories: 50,
        //         protein: 2,
        //         carbs: 2,
        //         fat: 0.1,
        //         sugar: 0,
        //         amountPer: 100,
        //         categoryId: breakfastId!.id,
        //     }, {
        //         name: 'Baked Salmon',
        //         calories: 378,
        //         protein: 21,
        //         fat: 22.4,
        //         carbs: 12,
        //         sugar: 0,
        //         amountPer: 100,
        //         categoryId: lunchId!.id,
        //     }]
        // });

        //  -- Read User Diet
        // const userDiet = await prisma.user.findFirst({
        //     where: {
        //         email: "hirechandan@gmail.com",
        //     },
        //     select: {
        //         diet: true,
        //     }
        // }).then(user => user?.diet);

        // // -- Add Food Item to user
        // await prisma.user.update({
        //     where: {
        //         email: "hirechandan@gmail.com",
        //     },
        //     data: {
        //         diet: {
        //             push: {
        //                 name: 'Food Name 3',
        //                 currentWeight: 100,
        //                 calories: 200,
        //                 protein: 10,
        //                 fat: 5,
        //                 carbs: 30,
        //                 sugar: 2,
        //                 amountPer: 100,
        //                 category: AllCategory.lunch,
        //             }
        //         }
        //     }
        // })

        // -- Update Food Item in user
        // await prisma.user.update({
        //     where: {
        //         email: "hirechandan@gmail.com",
        //     },
        //     data: {
        //         diet: {
        //             updateMany: {
        //                 where: {
        //                     id: "cm768argt0000frycwsxbpti0",
        //                 },
        //                 data: {
        //                     category: 'breakfast',
        //                 }
        //             }
        //         }
        //     }
        // })

        // -- Delete Food Item in user
        // await prisma.user.update({
        //     where: {
        //         email: "hirechandan@gmail.com",
        //     },
        //     data: {
        //         diet: {
        //             deleteMany: {
        //                 where: {
        //                     id: "some_id",
        //                 },
        //             }
        //         }
        //     }
        // })


        // -- List Food Items of User
        // const userId = await prisma.user.findFirst({ where: { email: "hirechandan@gmail.com" } }).then(user => user?.id);

        // if (!userId)
        //     return NextResponse.json(
        //         { message: "User Not Found" },
        //         { status: 400 }
        //     );

        // await prisma.foodItemList.create({
        //     data: {
        //         name: "Test Food Item",
        //         calories: 100,
        //         protein: 5,
        //         fat: 2,
        //         carbs: 7,
        //         sugar: 0,
        //         amountPer: 100,
        //         category: AllCategory.breakfast,
        //         user_id: userId,
        //     }
        // })


        //-- Find duplicate food item in diet of a user as per name and category
        // const duplicateItemCount = await prisma.user.count({
        //     where: {
        //       email: "hirechandan@gmail.com",
        //       diet: {
        //         some: {
        //           name: "Food Name 3",
        //           category: "lunch",
        //         }
        //       }
        //     }
        //   });

        // return NextResponse.json(
        //     { message: "Database Seeded Successfully" },
        //     { status: 200 }
        // );

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 503 },
        )
    }
}