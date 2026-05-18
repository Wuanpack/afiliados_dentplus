-- AlterTable
ALTER TABLE "Affiliate" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
