
import Stripe from "stripe";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CancelSubscriptionInput {
  subscriptionId: string; 
  cancelImmediately?: boolean; 
}

export const cancelSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { subscriptionId, cancelImmediately = false } =
      req.body as CancelSubscriptionInput;

    if (!subscriptionId) {
      res.status(400);
      throw new Error("Subscription ID is required");
    }

    // Fetch subscription from your database to obtain the Stripe Subscription ID
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existingSubscription || !existingSubscription.stripeSubscriptionId) {
      res.status(404);
      throw new Error("Active subscription not found");
    }

    let updatedStripeSubscription: Stripe.Subscription;

    // Cancel in Stripe
    if (cancelImmediately) {
      // Cancels the subscription right now (no further access)
      updatedStripeSubscription = await stripe.subscriptions.cancel(
        existingSubscription.stripeSubscriptionId
      );
    } else {
      // Default / Recommended: Cancels at the end of the current paid billing cycle
      updatedStripeSubscription = await stripe.subscriptions.update(
        existingSubscription.stripeSubscriptionId,
        { cancel_at_period_end: true }
      );
    }

    // Update subscription status in your database
    const updatedDbSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: updatedStripeSubscription.cancel_at_period_end
          ?? "CANCELED",
        cancelAtPeriodEnd: updatedStripeSubscription.cancel_at_period_end,
      },
    });

    // Send structured response
    res.status(200).json({
      success: true,
      message: cancelImmediately
        ? "Subscription canceled immediately."
        : "Subscription will cancel at the end of the billing cycle.",
      data: updatedDbSubscription,
    });
  }
);