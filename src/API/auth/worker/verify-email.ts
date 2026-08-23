import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { sendEmailService } from "../../../config/send-mail.js";
import redis from "../../../config/redis.js";

const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined, // Added for safety if password exists
  maxRetriesPerRequest: null,
});

export const verifyEmailWorker = new Worker(
  "verify-email",
  async (job) => {
    console.log("Worker processing job ID:", job.id);

    const email = job.data.email;
    if (!email) {
      throw new Error("No recipient email found in job payload.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Send Email
    await sendEmailService({
      to: email,
      subject: "Verify Email",
      otp: otp,
    });

    // 2. Save OTP in Redis using ioredis options object
    await redis.set(`otp:${email}`, otp, { EX: 120 });
  },
  { connection }
);

verifyEmailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} for ${job.data.email} has completed!`);
});

verifyEmailWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} has failed: ${err.message}`);
});