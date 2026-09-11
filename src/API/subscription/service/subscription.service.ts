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
    type = "FREE",
    monthlyRegularPrice,
    monthlyDiscountedPrice,
    yearlyRegularPrice,
    yearlyDiscountedPrice,
    features,
  }: SubscriptionPlanInput) {
    try {
      // Check if plan name already exists for this organization
      const existingPlan = await this.findSubscriptionPlanByName(name);
      if (existingPlan) {
        throw new ApiErrorHandler(
          409,
          `Subscription plan '${name}' already exists for this organization`,
        );
      }

      const now = new Date();
      const currentPeriodEnd = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000,
      );

      // Atomically create Subscription + SubscriptionPlan + PlanFeatures via nested write
      const subscription = await prisma.subscription.create({
        data: {
          organization: {
            connect: {
              id: this.orgId,
            },
          },
          currentPeriodStart: now,
          currentPeriodEnd: currentPeriodEnd,
          trialEndsAt: currentPeriodEnd,
          price: monthlyDiscountedPrice ?? monthlyRegularPrice ?? 0,
          plan: {
            create: {
              organizationId: this.orgId,
              name,
              description,
              type,
              monthlyRegularPrice,
              monthlyDiscountedPrice,
              yearlyRegularPrice,
              yearlyDiscountedPrice,
              features: features?.length
                ? {
                    create: [...new Set(features)].map((feature) => ({
                      feature,
                    })),
                  }
                : undefined,
            },
          },
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          plan: {
            include: {
              features: {
                select: {
                  id: true,
                  feature: true,
                  enabled: true,
                  limit: true,
                },
              },
            },
          },
        },
      });

      return subscription;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler) {
        throw error;
      }
      throw new ApiErrorHandler(
        500,
        error?.message ||
          `Failed to create subscription for organization ${this.orgId}`,
      );
    }
  }

  async findSubscriptionPlanByName(name: string) {
    try {
      const response = await prisma.subscriptionPlan.findFirst({
        where: {
          organizationId: this.orgId,
          name,
        },
      });
      return response;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler) throw error;
      throw new ApiErrorHandler(500, "Internal server error");
    }
  }

  async findSubscriptionByPlanId(planId: string) {
    try {
      const response = await prisma.subscription.findFirst({
        where: {
          organizationId: this.orgId,
          planId,
        },
        include: {
          plan: {
            include: {
              features: {
                select: {
                  id: true,
                  feature: true,
                  enabled: true,
                  limit: true,
                },
              },
            },
          },
        },
      });
      return response;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler) throw error;
      throw new ApiErrorHandler(
        500,
        error?.message || "Failed to find subscription",
      );
    }
  }

  async findSingleSubscription(id: string) {
    try {
      const response = await prisma.subscription.findUnique({
        where: {
          id,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          plan: {
            include: {
              features: {
                select: {
                  id: true,
                  feature: true,
                  enabled: true,
                  limit: true,
                },
              },
            },
          },
        },
      });
      return response;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler) throw error;
      throw new ApiErrorHandler(
        500,
        error?.message || "Failed to find subscription",
      );
    }
  }

  async findAllSubscriptions() {
    try {
      const response = await prisma.subscription.findMany({
        where: {
          organizationId: this.orgId,
        },
        include: {
          plan: {
            include: {
              features: {
                select: {
                  id: true,
                  feature: true,
                  enabled: true,
                  limit: true,
                },
              },
            },
          },
        },
      });
      return response;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler) throw error;
      throw new ApiErrorHandler(
        500,
        error?.message || "Failed to fetch subscriptions",
      );
    }
  }
  
  async deleteSubscriptionById(id: string){
    try{
      await prisma.subscription.delete({
        where: {
          id,
        },
      });
      return null;
    }catch(error: any){
      if (error instanceof ApiErrorHandler) throw error;
      throw new ApiErrorHandler(
        500,
        error?.message || "Failed to delete subscription",
      );
    }
  }

  async deleteSubscriptionPlan(planId: string) {
    try{
      const getSubscription = await prisma.subscription.findFirst({
        where: {
          planId,
          organizationId: this.orgId
        }
      })
      if(getSubscription){
        await this.deleteSubscriptionById(getSubscription.id)
      }
      await prisma.subscriptionPlan.delete({
        where: {
          id: planId,
        },
      });
      return null;
    }catch(error: any){
      if (error instanceof ApiErrorHandler) throw error;
      throw new ApiErrorHandler(
        500,
        error?.message || "Failed to delete subscription",
      );
    }
  }
}
