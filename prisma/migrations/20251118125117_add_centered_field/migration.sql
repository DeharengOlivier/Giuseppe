-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "showInNav" BOOLEAN NOT NULL DEFAULT true,
    "showInFooter" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "centered" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Page" ("content", "createdAt", "icon", "id", "order", "published", "showInFooter", "showInNav", "slug", "title", "type", "updatedAt") SELECT "content", "createdAt", "icon", "id", "order", "published", "showInFooter", "showInNav", "slug", "title", "type", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
