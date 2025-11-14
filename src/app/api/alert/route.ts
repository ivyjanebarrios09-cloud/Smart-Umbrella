'use server';

import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

// Zod schema for request validation
const alertSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  umbrellaId: z.string().min(1, { message: 'Umbrella ID is required.' }),
  type: z.string().default('left_behind'),
  message: z.string().min(1, { message: 'Message is required.' }),
});

// Initialize Firebase Admin SDK
// This is a server-side operation, so we use the Admin SDK.
// It will automatically use Application Default Credentials in the App Hosting environment.
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

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

    const { userId, umbrellaId, type, message } = parsedData.data;

    // Create a new notification log entry
    const newLogRef = db.collection(`users/${userId}/notification_logs`).doc();
    const newLog = {
      id: newLogRef.id,
      userId,
      umbrellaId,
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    // Save to Firestore
    await newLogRef.set(newLog);

    return NextResponse.json(
      { success: true, notificationId: newLogRef.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating notification log:', error);
    return NextResponse.json(
      { error: 'Failed to create notification log', details: error.message },
      { status: 500 }
    );
  }
}
