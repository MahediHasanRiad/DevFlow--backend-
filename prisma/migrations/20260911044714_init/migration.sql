-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "discountAmount" DECIMAL(10,2),
ADD COLUMN     "regularPrice" DECIMAL(10,2),
ALTER COLUMN "price" DROP NOT NULL;
