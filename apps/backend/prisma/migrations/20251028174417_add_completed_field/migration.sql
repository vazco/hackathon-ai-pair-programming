-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstWinnerName" TEXT NOT NULL,
    "firstWinnerGithub" TEXT NOT NULL,
    "secondWinnerName" TEXT NOT NULL,
    "secondWinnerGithub" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_History" ("createdAt", "firstWinnerGithub", "firstWinnerName", "id", "secondWinnerGithub", "secondWinnerName") SELECT "createdAt", "firstWinnerGithub", "firstWinnerName", "id", "secondWinnerGithub", "secondWinnerName" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
CREATE INDEX "History_firstWinnerGithub_idx" ON "History"("firstWinnerGithub");
CREATE INDEX "History_secondWinnerGithub_idx" ON "History"("secondWinnerGithub");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
