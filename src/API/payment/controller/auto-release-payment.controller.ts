import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { prisma } from "../../../lib/prisma.js";
import { Queue } from "bullmq";

export const PaymentReleaseController = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const myQueue = new Queue("payment-release");

  // 1. Fetch the recipient user and their connected account ID
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { user: true }, // Assumes relation to User
  });
  if (!job) throw new ApiErrorHandler(404, "job not found");

  // get payment amount
  const paymentAmount = await prisma.quote_and_billing.findFirst({
    where: { AND: [{ jobId: jobId }, { status: "ACCEPTED" }] },
  });
  if (!paymentAmount)
    throw new ApiErrorHandler(404, "job proposal not found to release payment");
  const releasePaymentAmount = paymentAmount?.subTotalAmount;

  const stripeAccountId = job?.user?.stripeAccountId;

  if (!stripeAccountId) {
    throw new ApiErrorHandler(
      400,
      "Professional has not set up their payout bank account yet.",
    );
  }

  // check, is this professional or business
  const findEmployee = await prisma.professional.findFirst({
    where: { id: job.professionalId! },
  });
  let jobType;
  if (findEmployee?.type === "COMPANY") {
    jobType = "B2B";
  } else {
    jobType = "B2C";
  }

  // Convert payout amount to integer cents (e.g., €80.00 -> 8000)
  const amountInCents = Math.round(releasePaymentAmount.toNumber() * 100);

  // set in queue
  await myQueue.add("payment-release", {
    amountInCents,
    stripeAccountId,
    jobId,
    jobType,
  });

  res.status(200).json({
    success: true,
    message: "Money successfully released to user's account.",
    jobId: jobId,
  });
});
