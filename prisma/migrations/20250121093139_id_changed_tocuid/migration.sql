/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id", "name") SELECT "id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_FoodItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentWeight" INTEGER NOT NULL DEFAULT 0,
    "calories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "sugar" INTEGER NOT NULL,
    "amountPer" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "FoodItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FoodItem" ("amountPer", "calories", "carbs", "categoryId", "currentWeight", "fat", "id", "name", "protein", "sugar") SELECT "amountPer", "calories", "carbs", "categoryId", "currentWeight", "fat", "id", "name", "protein", "sugar" FROM "FoodItem";
DROP TABLE "FoodItem";
ALTER TABLE "new_FoodItem" RENAME TO "FoodItem";
CREATE UNIQUE INDEX "FoodItem_name_key" ON "FoodItem"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
