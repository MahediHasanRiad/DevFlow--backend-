import { asyncHandler } from "../../../shared/asyncHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { prisma } from "../../../lib/prisma.js";
import Stripe from "stripe";

const stripeClient = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export const SessionStatusController = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  if (!userId) throw new ApiErrorHandler(401, "unauthorized");

  const sessionId = req.query.session_id;
  if (!sessionId || typeof sessionId !== "string") {
    throw new ApiErrorHandler(400, "Missing or invalid session_id");
  }

  // 1. Database Lookup
  let payment = await prisma.payment.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
  });

  if (!payment) throw new ApiErrorHandler(404, "payment not found");
  if (payment.userId !== userId) throw new ApiErrorHandler(403, "forbidden");

  // 2. ⚡ RACE CONDITION FALLBACK: 
  // If DB says UNPAID, ask Stripe directly in real-time and self-heal the DB!
  if (payment.paymentStatus !== "PAID") {
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      payment = await prisma.payment.update({
        where: { stripeCheckoutSessionId: sessionId },
        data: {
          status: 'RELEASED',
          paymentStatus: "PAID",
          stripePaymentIntentId: session.payment_intent as string,
        },
      });
    }
  }

  res.status(200).json(
    new apiResponse(
      {
        status: payment.status,
        paymentStatus: payment.paymentStatus,
        jobId: payment.jobId,
        amount: payment.amount,
      },
      "successful"
    )
  );
});