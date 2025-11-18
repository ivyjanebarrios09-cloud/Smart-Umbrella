
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin initialization error', error.stack);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
