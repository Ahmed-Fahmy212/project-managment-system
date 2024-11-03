-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isDeleted" SET DEFAULT false;
