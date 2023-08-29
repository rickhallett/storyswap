/*
  Warnings:

  - Added the required column `goodreadsId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goodreadsRating` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goodreadsRatings` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smallImageURL` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "smallImageURL" TEXT NOT NULL,
    "goodreadsId" INTEGER NOT NULL,
    "goodreadsRating" INTEGER NOT NULL,
    "goodreadsRatings" INTEGER NOT NULL,
    "publicationYear" INTEGER,
    CONSTRAINT "Book_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "BookCondition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "BookStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("author", "conditionId", "created_at", "description", "genreId", "id", "statusId", "title", "userId") SELECT "author", "conditionId", "created_at", "description", "genreId", "id", "statusId", "title", "userId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
