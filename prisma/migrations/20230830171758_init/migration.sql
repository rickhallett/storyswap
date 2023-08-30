-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bio" TEXT
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- CreateTable
CREATE TABLE "BookStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BookCondition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SwapRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SwapRequest_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_id_fkey" FOREIGN KEY ("id") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_id_fkey" FOREIGN KEY ("id") REFERENCES "SwapRequestStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SwapRequestStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Note_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NoteImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "NoteImage_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expirationDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "digits" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "expiresAt" DATETIME
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerName" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Traffic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Traffic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_userGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_userGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_userGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BookStatus_name_key" ON "BookStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BookCondition_name_key" ON "BookCondition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SwapRequestStatus_name_key" ON "SwapRequestStatus"("name");

-- CreateIndex
CREATE INDEX "Note_ownerId_idx" ON "Note"("ownerId");

-- CreateIndex
CREATE INDEX "Note_ownerId_updatedAt_idx" ON "Note"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "NoteImage_noteId_idx" ON "NoteImage"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_entity_access_key" ON "Permission"("action", "entity", "access");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerId_key" ON "Connection"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerName_providerId_key" ON "Connection"("providerName", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerId_userId_key" ON "Connection"("providerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_userGenres_AB_unique" ON "_userGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_userGenres_B_index" ON "_userGenres"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");
