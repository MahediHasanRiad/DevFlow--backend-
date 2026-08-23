import { Worker } from "bullmq";
import { Redis } from "ioredis";
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma.js";

const connection = new Redis({ maxRetriesPerRequest: null });
const stripeClient = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

const paymentRelease = new Worker(
  "payment-release",
  async (job: any) => {

    let commissionRate = 0;

    if (job.jobType === "B2B") {
      commissionRate = 10;
    } else {
      commissionRate = 0;
    }

    // Calculate split
    const platformFeeAmount = job.amountInCents * (commissionRate / 100);
    const professionalPayoutAmount = job.amountInCents - platformFeeAmount;

    // Automatically transfer money to their bank account via Stripe Connect
    await stripeClient.transfers.create({
      amount: professionalPayoutAmount,
      currency: "eur",
      destination: job.stripeAccountId, // Sent directly to their connected account!
      description: `Auto release payment for Job #${job.jobId}`,
    });

    // 3. Update payment status in DB
    await prisma.payment.updateMany({
      where: { jobId: job.jobId },
      data: { status: "RELEASED" },
    });
  },
  { connection },
);

paymentRelease.on("completed", (job) => {
  console.log(`${job?.id} has completed!`);
});

paymentRelease.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
