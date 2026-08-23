import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import Stripe from "stripe";

const stripeClient = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export const CreatePaymentCheckoutController = asyncHandler(
  async (req, res) => {
    const {
      jobId,
      totalHoursToComplete,
      hourlyRate,
      materialPrice = 0,
      discountAmount = 0,
      depositAmount,
      depositRequiredPercentage,
      vatPercentage,
      status,
    } = req.body;

    const userId = req.user?.id as string;
    if (!userId) throw new ApiErrorHandler(401, "unauthorized");

    // 1. Fixed Financial Calculations
    const laborCost = totalHoursToComplete * hourlyRate;
    const netMaterialCost = materialPrice - discountAmount;
    const beforeTax = laborCost + netMaterialCost;

    // Convert to integer cents for Stripe (e.g., 100.50 EUR -> 10050)
    const unitAmountInCents = Math.round(beforeTax * 100);

    // 2. Create Stripe Checkout Session
    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",

      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Deposit for Job #${jobId}`,
              description: `Total Hours: ${totalHoursToComplete} @ €${hourlyRate}/hr`,
            },
            unit_amount: unitAmountInCents, // Passed in CENTS to Stripe
          },
          quantity: 1,
        },
      ],

      // Included userId so webhooks can identify the owner
      metadata: {
        userId: String(userId),
        jobId: String(jobId),
        status: String(status),
        totalHoursToComplete: String(totalHoursToComplete),
        hourlyRate: String(hourlyRate),
        materialPrice: String(materialPrice),
        discountAmount: String(discountAmount),
        depositRequiredPercentage: String(depositRequiredPercentage),
        vatPercentage: String(vatPercentage),
      },
    });

    // 3. Save Payment Record in Prisma (PostgreSQL)
    const addPayment = await prisma.payment.create({
      data: {
        userId: userId,
        jobId: jobId,
        stripeCheckoutSessionId: session.id,
        amount: beforeTax, 
        currency: "eur",
        status: 'HOLD',
        paymentStatus: 'PAID',
        metadata: {
          totalHoursToComplete,
          hourlyRate,
          materialPrice,
          discountAmount,
          depositRequiredPercentage,
          vatPercentage,
        },
      },
    });

    // 4. Return Session URL to Frontend
    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      data: addPayment,
    });
  },
);
