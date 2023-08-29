/*
  Warnings:

  - You are about to drop the column `referer` on the `Traffic` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Traffic` table without a default value. This is not possible if the table is not empty.

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
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Traffic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Traffic_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Traffic" ("createdAt", "id", "ip", "userAgent") SELECT "createdAt", "id", "ip", "userAgent" FROM "Traffic";
DROP TABLE "Traffic";
ALTER TABLE "new_Traffic" RENAME TO "Traffic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
