import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { SubscriptionPlanInput } from "../schema/subscription.schema.js";

export class SubscriptionService {
  private orgId: string;

  constructor(orgId: string) {
    this.orgId = orgId;
  }

  async createSubscription({
    name,
    description,
    type,
    monthlyRegularPrice,
    monthlyDiscountedPrice,
    yearlyRegularPrice,
    yearlyDiscountedPrice,
    features,
  }: SubscriptionPlanInput) {
    try {
      const subscriptionPlan = await this.createSubscriptionPlan({
        name,
        description,
        type,
        monthlyRegularPrice,
        monthlyDiscountedPrice,
        yearlyRegularPrice,
        yearlyDiscountedPrice,
        features,
      });
      await this.createFeatures({ planId: subscriptionPlan.id, features });

      // check already exist
      const existSubscription = await this.findSubscriptionByPlanId(subscriptionPlan.id);
      if(existSubscription) return new ApiErrorHandler(400, "Subscription already exists"); 

      const subscription = await prisma.subscription.create({
        data: {
          organizationId: this.orgId,
          planId: subscriptionPlan?.id,
        },
        include: {
          organization: {
            select: {
              name: true,
              slug: true,
            },
          },
          subscriptionPlan: {
            select: {
              name: true,
              description: true,
              type: true,
              monthlyPrice: true,
              yearlyPrice: true,
              features: {
                select: {
                  feature: true,
                },
              },
            },
          },
        },
      });
      console.log('sub', subscription)
      return subscription;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler)
        throw new ApiErrorHandler(error.statusCode, error.message);
    }
  }

  async createSubscriptionPlan({
    name,
    description,
    type = "FREE",
    monthlyRegularPrice,
    monthlyDiscountedPrice,
    yearlyRegularPrice,
    yearlyDiscountedPrice,
  }: SubscriptionPlanInput) {
    try {
      const exists = await this.findSubscriptionPlanByName(name);
      if (exists) {
        throw new Error(
          `Subscription plan with name ${name} already exists for organization ${this.orgId}`,
        );
      }

      const response = await prisma.subscriptionPlan.create({
        data: {
          organizationId: this.orgId,
          name,
          description,
          type,
          monthlyRegularPrice,
          monthlyDiscountedPrice,
          yearlyRegularPrice,
          yearlyDiscountedPrice,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(
        `Failed to create subscription for organization ${this.orgId}`,
        { cause: error },
      );
    }
  }

  async createFeatures({
    planId,
    features,
  }: {
    planId: string;
    features: string[];
  }) {
    try {
      // check already exist or not
      const newFeatures: string[] = [];
      const findExistsPlanFeatures = await this.findFeaturesByNames(features);

      if (findExistsPlanFeatures.length > 0) {
        findExistsPlanFeatures.forEach((feature: any) => {
          newFeatures.push(feature.feature);
        });
      }

      const subscriptionFeatures = await prisma.subscriptionFeature.createMany({
        data: newFeatures.map((feature) => ({
          planId,
          feature,
        })),
      });
      return subscriptionFeatures;
    } catch (error:any) {
      console.log(error);
      throw new ApiErrorHandler(error);
    }
  }

  async findSubscriptionPlanByName(name: string) {
    try {
      const response = await prisma.subscriptionPlan.findFirst({
        where: {
          organizationId: this.orgId,
          name: name,
        },
      });
      return response;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler)
        throw new ApiErrorHandler(error.statusCode, error.message);
      throw new ApiErrorHandler(500, "Internal server error");
    }
  }

  async findFeaturesByNames(features: string[]) {
    try {
      const response = await prisma.planFeature.findMany({
        where: {
          feature: {
            in: features,
          },
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(
        `Failed to find features for organization ${this.orgId}`,
        { cause: error },
      );
    }
  }

  async findSubscriptionByPlanId(planId: string) {
    try {
      const response = await prisma.subscription.findFirst({
        where: {
          organizationId: this.orgId,
          planId: planId,
        },
        include: {
          subscriptionPlan: {
            include: {
              features: {
                select: {
                  feature: true,
                },
              },
            },
          },
        },
      });
      return response;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler)
        throw new ApiErrorHandler(error.statusCode, error.message);
      throw new ApiErrorHandler(500, error);
    }
  }

}
