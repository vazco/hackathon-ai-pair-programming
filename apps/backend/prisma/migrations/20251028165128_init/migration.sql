-- CreateTable
CREATE TABLE "WeeklyWinner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_winner_id" TEXT NOT NULL,
    "second_winner_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
