import Stripe from "stripe";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { prisma } from "../../../lib/prisma.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface PaymentInputValueType {
  planId: string; 
  billingCycle: "monthly" | "yearly";
  userId: string;
  userEmail: string;
}

export const createPaymentController = asyncHandler(
  async (req, res) => {

    const { planId, billingCycle, userId, userEmail } =
      req.body as PaymentInputValueType;


    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found or inactive.",
      });
    }

    // Determine price based on selected billing cycle
    const isYearly = billingCycle === "yearly";
    const selectedPrice = isYearly
      ? plan.yearlyDiscountedPrice ?? plan.yearlyRegularPrice
      : plan.monthlyDiscountedPrice ?? plan.monthlyRegularPrice;

    if (!selectedPrice) {
      return res.status(400).json({
        success: false,
        message: `No price configured for ${billingCycle} billing cycle.`,
      });
    }

    // Convert decimal price to cents (Stripe requires amounts in smallest currency unit)
    const unitAmountInCents = Math.round(Number(selectedPrice) * 100);

    // Create Checkout Session with dynamic inline price_data
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: (plan.currency || "usd").toLowerCase(),
            product_data: {
              name: plan.name,
              description: plan.description || undefined,
            },
            unit_amount: unitAmountInCents,
            recurring: {
              interval: isYearly ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId,
          planId: plan.id,
          billingCycle,
        },
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  }
);