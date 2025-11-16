import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase/firestore';

// Initialize Firebase Admin SDK
// This should only be done once per server instance.
// Ensure you have the GOOGLE_APPLICATION_CREDENTIALS environment variable set.
if (!admin.apps.length) {
  try {
    // Attempt to initialize with application default credentials
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = admin.firestore();
const fcm = admin.messaging();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, umbrellaId, fcmToken } = body;

    // Validate request body
    if (!userId || !umbrellaId || !fcmToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, umbrellaId, or fcmToken',
        },
        { status: 400 }
      );
    }

    // 1. Create Notification Log
    const notificationMessage = 'It looks like you left your umbrella behind!';
    const notificationLog = {
      userId,
      umbrellaId,
      type: 'left_behind',
      message: notificationMessage,
      timestamp: Timestamp.now(),
    };

    const logRef = await db
      .collection('users')
      .doc(userId)
      .collection('notification_logs')
      .add(notificationLog);

    // 2. Send Push Notification via FCM v1 API
    const payload: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title: 'Umbrella Left Behind!',
        body: notificationMessage,
      },
      webpush: {
        fcmOptions: {
          link: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/dashboard/notifications`,
        },
      },
    };

    await fcm.send(payload);

    return NextResponse.json({
      success: true,
      message: 'Alert sent successfully',
      logId: logRef.id,
    });
  } catch (error: any) {
    console.error('Error sending alert:', error);
    // Provide a more structured error response
    return NextResponse.json(
      { success: false, error: 'Failed to send alert', details: error.message },
      { status: 500 }
    );
  }
}
