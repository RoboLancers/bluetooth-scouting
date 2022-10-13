/*
  Warnings:

  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Option";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Schema";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Input" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    "step" INTEGER
);

-- CreateTable
CREATE TABLE "InputOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "inputId" INTEGER,
    CONSTRAINT "InputOption_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "Input" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isMatch" BOOLEAN NOT NULL
);
