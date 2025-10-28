/*
  Warnings:

  - You are about to drop the column `first_winner_id` on the `WeeklyWinner` table. All the data in the column will be lost.
  - You are about to drop the column `second_winner_id` on the `WeeklyWinner` table. All the data in the column will be lost.
  - Added the required column `pair1User1` to the `WeeklyWinner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pair1User2` to the `WeeklyWinner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekEnd` to the `WeeklyWinner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekStart` to the `WeeklyWinner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CycleState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eligibleUserGithubs" TEXT NOT NULL,
    "cycleStartedAt" DATETIME,
    "allUsersSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Winner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user1Github" TEXT NOT NULL,
    "user1Name" TEXT NOT NULL,
    "user2Github" TEXT NOT NULL,
    "user2Name" TEXT NOT NULL,
    "selectedAt" DATETIME NOT NULL,
    "week" TEXT NOT NULL,
    "cycleStateId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeeklyWinner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weekStart" DATETIME NOT NULL,
    "weekEnd" DATETIME NOT NULL,
    "pair1User1" TEXT NOT NULL,
    "pair1User2" TEXT NOT NULL,
    "pair2User1" TEXT,
    "pair2User2" TEXT,
    "pair3User1" TEXT,
    "pair3User2" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WeeklyWinner" ("createdAt", "id") SELECT "createdAt", "id" FROM "WeeklyWinner";
DROP TABLE "WeeklyWinner";
ALTER TABLE "new_WeeklyWinner" RENAME TO "WeeklyWinner";
CREATE INDEX "WeeklyWinner_weekStart_idx" ON "WeeklyWinner"("weekStart");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_github_key" ON "User"("github");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- CreateIndex
CREATE INDEX "User_github_idx" ON "User"("github");

-- CreateIndex
CREATE INDEX "Winner_week_idx" ON "Winner"("week");

-- CreateIndex
CREATE INDEX "Winner_selectedAt_idx" ON "Winner"("selectedAt");
