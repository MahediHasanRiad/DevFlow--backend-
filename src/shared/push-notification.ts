// src/shared/pushNotification.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { prisma } from "../lib/prisma.js";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error('Missing Firebase Admin environment variables in .env file.');
}

const serviceAccount = {
  projectId,
  clientEmail,
  privateKey,
};

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Sends a push notification to multiple device tokens for a user.
 */
export async function sendPushNotification(
  tokens: string[],
  payload: NotificationPayload,
) {
  if (!tokens || tokens.length === 0) return;

  const message = {
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data || {},
    tokens: tokens, // Accepts an array of tokens
  };

  try {
    const response = await getMessaging().sendEachForMulticast(message);
    console.log(`Successfully sent ${response.successCount} messages.`);

    // Optional: Clean up invalid/expired tokens from your DB
    if (response.failureCount > 0) {
      const failedTokensToDelete: string[] = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          const token = tokens[idx];

          // Check if the token is invalid or no longer registered
          if (
            token &&
            (errorCode === "messaging/registration-token-not-registered" ||
              errorCode === "messaging/invalid-registration-token")
          ) {
            failedTokensToDelete.push(token);
          }
        }
      });

      // Delete all stale tokens from Prisma in a single query
      if (failedTokensToDelete.length > 0) {
        await prisma.deviceToken.deleteMany({
          where: {
            token: { in: failedTokensToDelete },
          },
        });
        console.log(
          `Cleaned up ${failedTokensToDelete.length} stale FCM tokens.`,
        );
      }
    }
    console.log(response)
    return response
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
