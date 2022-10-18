/*
  Warnings:

  - You are about to drop the `InputOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `isMatch` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `max` on the `Input` table. All the data in the column will be lost.
  - You are about to drop the column `min` on the `Input` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `Input` table. All the data in the column will be lost.
  - Added the required column `type` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InputOption";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Form" ("id") SELECT "id" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_Input" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "booleanValue" BOOLEAN,
    "numberValue" REAL,
    "stringValue" TEXT,
    "formId" INTEGER,
    CONSTRAINT "Input_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Input" ("id", "title", "type") SELECT "id", "title", "type" FROM "Input";
DROP TABLE "Input";
ALTER TABLE "new_Input" RENAME TO "Input";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
