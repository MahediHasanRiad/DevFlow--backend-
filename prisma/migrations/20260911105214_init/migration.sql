-- DropForeignKey
ALTER TABLE "plan_features" DROP CONSTRAINT "plan_features_planId_fkey";

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
