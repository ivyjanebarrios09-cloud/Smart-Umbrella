
'use server';

import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

// Zod schema for request validation
const alertSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  deviceId: z.string().min(1, { message: 'Device ID is required.' }),
  message: z.string().min(1, { message: 'Message is required.' }),
  type: z.string().default('left_behind'),
  fcmToken: z.string().optional(), // fcmToken is optional but recommended
});

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = getFirestore();
const fcm = admin.messaging();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedData = alertSchema.safeParse(json);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, deviceId, type, message, fcmToken } = parsedData.data;

    // 1. Create a new notification log entry
    const newLogRef = db.collection(`users/${userId}/notification_logs`).doc();
    const newLog = {
      id: newLogRef.id,
      userId,
      deviceId,
      type,
      message,
      timestamp: Timestamp.now(), // Use Firestore Timestamp
    };

    await newLogRef.set(newLog);

    // 2. Send Push Notification if fcmToken is provided
    if (fcmToken) {
      const payload: admin.messaging.Message = {
        token: fcmToken,
        notification: {
          title: 'Device Left Behind!',
          body: message,
        },
        webpush: {
          fcmOptions: {
            link: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/dashboard/notifications`,
          },
        },
      };

      await fcm.send(payload);
    }

    return NextResponse.json(
      { success: true, notificationId: newLogRef.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating notification log:', error);
    // Return a more generic error to the client for security
    if (error.code === 'permission-denied') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        );
    }
    
    return NextResponse.json(
      { error: 'Failed to create notification log', details: error.message },
      { status: 500 }
    );
  }
}
