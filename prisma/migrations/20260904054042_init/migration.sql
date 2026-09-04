/*
  Warnings:

  - You are about to drop the column `designation` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_designation_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "designation";

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");
