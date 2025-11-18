import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
    });
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
