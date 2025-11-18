// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    // When deployed to Firebase/Google Cloud, the SDK will automatically
    // find the service account credentials. For local development,
    // you would typically use a service account JSON file.
    admin.initializeApp();
  } catch (error: any) {
    // In a local environment without default credentials, you might need
    // to initialize with a service account key file.
    // However, for App Hosting, argument-less initializeApp is correct.
    console.error('Firebase admin initialization error', error);
    // Avoid initializing with potentially missing env vars which causes build failures.
    // The error "Request had invalid authentication credentials" at runtime is better than a build failure.
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
