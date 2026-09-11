-- DropIndex
DROP INDEX IF EXISTS "plan_features_planId_key";

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "plan_features_planId_feature_key" ON "plan_features"("planId", "feature");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "plan_features_planId_idx" ON "plan_features"("planId");
