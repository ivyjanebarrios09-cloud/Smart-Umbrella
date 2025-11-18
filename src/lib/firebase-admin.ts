// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Initialize only once (important for Vercel/serverless)
if (!admin.apps.length) {
  // When running on App Hosting, the SDK automatically discovers the correct service account credentials
  // from the environment.
  admin.initializeApp();
}

// These two exports are exactly what your API route needs
export const db = admin.firestore();
export const auth = admin.auth();
