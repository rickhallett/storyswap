-- CreateTable
CREATE TABLE "Traffic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "referer" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL
);
