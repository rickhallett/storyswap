/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Traffic` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Traffic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Traffic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Traffic" ("createdAt", "id", "ip", "type", "userAgent", "userId") SELECT "createdAt", "id", "ip", "type", "userAgent", "userId" FROM "Traffic";
DROP TABLE "Traffic";
ALTER TABLE "new_Traffic" RENAME TO "Traffic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
