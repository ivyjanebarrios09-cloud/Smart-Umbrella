
'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

const alertSchema = z.object({
  idToken: z.string(),
  deviceId: z.string(),
  message: z.string(),
  type: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsedData = alertSchema.safeParse(json);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsedData.error.flatten() }, { status: 400 });
    }

    const { idToken, deviceId, message, type } = parsedData.data;

    // 1. Verify the ID token using the Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Write to the user's `alerts` subcollection in Firestore
    const alertRef = db.collection('users').doc(uid).collection('alerts').doc();
    
    await alertRef.set({
      id: alertRef.id,
      userId: uid,
      deviceId: deviceId,
      message: message,
      type: type,
      timestamp: Timestamp.now(),
    });
    
    // Also log to notification_logs for history
    const logRef = db.collection('users').doc(uid).collection('notification_logs').doc();
    await logRef.set({
      id: logRef.id,
      userId: uid,
      deviceId: deviceId,
      message: message,
      type: type,
      timestamp: Timestamp.now(),
    });

    // 3. Send alert to the ESP32 backend service
    // IMPORTANT: Replace 'http://localhost:3000/umbrella-alert' with your actual backend URL
    const backendUrl = process.env.UMBRELLA_BACKEND_URL || 'https://firestore.googleapis.com/v1/projects/studio-2370514225-ff786/databases/(default)/documents/users/d2La4nKBSUQYTF5aokjYjo1x3NH3/alert_requests/esp32_secret_x9k2m7p4q8z1w3v6t5y9r2n8c7f';
    
    try {
      await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uid,
          umbrellaId: deviceId,
          message: 'Device triggered from web app',
          type: 'ring',
        }),
      });
    } catch (fetchError) {
        // Log the error but don't fail the entire request, 
        // as the alert is already saved in Firestore.
        console.error('Failed to send alert to ESP32 backend:', fetchError);
    }


    return NextResponse.json({ success: true, alertId: alertRef.id }, { status: 200 });

  } catch (error: any) {
    console.error('Error in trigger-alert route:', error);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
       return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred', details: error.message }, { status: 500 });
  }
}
