import { BrevoClient } from "@getbrevo/brevo";
import { getOTPTemplate } from "../shared/email-template.js";

// Ensure API key is loaded
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
  console.warn("⚠️ Warning: BREVO_API_KEY environment variable is missing.");
}

const brevo = new BrevoClient({
  apiKey: apiKey || "",
});

interface SendEmailOptions {
  to: string;
  subject: string;
  otp: string;
}

export async function sendEmailService({
  to,
  subject,
  otp,
}: SendEmailOptions): Promise<any> {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      sender: {
        name: "My App Team",
        email: "riad.maktech@gmail.com", // Must be verified in Brevo Dashboard -> Senders
      },
      to: [
        {
          email: to,
        },
      ],
      htmlContent: getOTPTemplate(otp),
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error: any) {
    // Log detailed response error if available from Brevo SDK
    console.error(
      "Failed to send email via Brevo:",
      error?.response?.body || error?.message || error
    );
    throw error;
  }
}