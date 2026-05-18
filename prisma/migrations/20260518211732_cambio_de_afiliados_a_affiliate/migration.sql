/*
  Warnings:

  - You are about to drop the `Afiliado` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Afiliado" DROP CONSTRAINT "Afiliado_membershipTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Afiliado" DROP CONSTRAINT "Afiliado_userId_fkey";

-- DropTable
DROP TABLE "Afiliado";

-- CreateTable
CREATE TABLE "Affiliate" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "membershipTypeId" INTEGER NOT NULL,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_email_key" ON "Affiliate"("email");

-- AddForeignKey
ALTER TABLE "Affiliate" ADD CONSTRAINT "Affiliate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affiliate" ADD CONSTRAINT "Affiliate_membershipTypeId_fkey" FOREIGN KEY ("membershipTypeId") REFERENCES "MembershipType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
