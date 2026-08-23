import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { getOTPTemplate } from "../../../shared/email-template.js";
import { sendEmailService } from "../../../config/send-mail.js";


const connection = new Redis({
  maxRetriesPerRequest: null,
});

interface SendOTPJobData {
  to: string;
  subject: string;
  otp: string;
}

export const sendOTPworker = new Worker<SendOTPJobData>(
  "send-otp",
  async (job) => {
    const { to, subject, otp } = job.data;

    await sendEmailService({
      to,
      subject,
      otp: getOTPTemplate(otp),
    });
  },
  { connection },
);

sendOTPworker.on("completed", (job) => {
  console.log(`[BullMQ] Job ${job.id} completed successfully`);
});

sendOTPworker.on("failed", (job, err) => {
  console.error(`[BullMQ] Job ${job?.id} failed with error:`, err.message);
});
