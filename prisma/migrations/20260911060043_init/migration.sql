/*
  Warnings:

  - You are about to drop the column `monthlyPrice` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `yearlyPrice` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `regularPrice` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_plans" DROP COLUMN "monthlyPrice",
DROP COLUMN "yearlyPrice",
ADD COLUMN     "monthlyDiscountedPrice" DECIMAL(10,2),
ADD COLUMN     "monthlyRegularPrice" DECIMAL(10,2),
ADD COLUMN     "yearlyDiscountedPrice" DECIMAL(10,2),
ADD COLUMN     "yearlyRegularPrice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "discountAmount",
DROP COLUMN "regularPrice";
