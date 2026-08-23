// import "dotenv/config";
// import { initializeApp, cert, getApps, getApp, type App } from "firebase-admin/app";
// import type { ServiceAccount } from "firebase-admin";
// import { getAuth, type Auth } from "firebase-admin/auth";
// import { getMessaging, type Messaging } from "firebase-admin/messaging";

// function normalizePrivateKey(raw: string | undefined): string | undefined {
//   if (!raw) return undefined;

//   let key = raw.trim();

//   key = key.replace(/^["']|["']$/g, "");
//   key = key.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");

//   return key.trim();
// }

// const projectId = process.env.FIREBASE_PROJECT_ID;
// const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

// // Fail fast with a clear message instead of a cryptic OpenSSL trace
// const missing = [
//   !projectId && "FIREBASE_PROJECT_ID",
//   !clientEmail && "FIREBASE_CLIENT_EMAIL",
//   !privateKey && "FIREBASE_PRIVATE_KEY",
// ].filter(Boolean);

// if (missing.length > 0) {
//   throw new Error(`Firebase Admin: missing env var(s): ${missing.join(", ")}`);
// }

// if (
//   !privateKey!.includes("-----BEGIN PRIVATE KEY-----") ||
//   !privateKey!.includes("-----END PRIVATE KEY-----")
// ) {
//   console.error(
//     "Firebase Admin: private key is malformed. First 60 chars:",
//     JSON.stringify(privateKey!.slice(0, 60))
//   );
//   throw new Error(
//     "FIREBASE_PRIVATE_KEY is missing BEGIN/END markers. It was likely truncated or had its " +
//     "newlines stripped when pasted into the platform's env var UI. Paste the key as a single " +
//     "line with literal \\n sequences (exactly as it appears in the downloaded service account " +
//     "JSON's private_key field), not as a multiline value."
//   );
// }

// const credentialData: ServiceAccount = {
//   projectId: projectId!,
//   clientEmail: clientEmail!,
//   privateKey: privateKey!,
// };

// const firebaseApp: App =
//   getApps().length > 0
//     ? getApp()
//     : initializeApp({
//         credential: cert(credentialData),
//       });

// console.log("🔥 Firebase Admin successfully initialized for project:", firebaseApp.name);

// export const authAdmin: Auth = getAuth(firebaseApp);
// export const messagingAdmin: Messaging = getMessaging(firebaseApp);