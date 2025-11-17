'use server';

import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = getFirestore();

const weatherSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    location_str: z.string(),
    time: z.string(),
    updatedAt: z.number(),
    temperature: z.number(),
    windspeed: z.number(),
    condition: z.string(),
    weathercode: z.number(),
    forecast_daily_raw: z.string(),
});


/**
 * @description Get the current weather data.
 * @method GET
 */
export async function GET() {
  try {
    const weatherRef = db.doc('weather/current');
    const docSnap = await weatherRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Weather data not found' }, { status: 404 });
    }

    return NextResponse.json(docSnap.data(), { status: 200 });
  } catch (error: any) {
    console.error('Error getting weather data:', error);
    return NextResponse.json({ error: 'Failed to get weather data', details: error.message }, { status: 500 });
  }
}

/**
 * @description Update the current weather data.
 * @method POST
 */
export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsedData = weatherSchema.safeParse(json);

        if (!parsedData.success) {
            return NextResponse.json({ error: 'Invalid input', details: parsedData.error.flatten() }, { status: 400 });
        }

        const weatherRef = db.doc('weather/current');
        await weatherRef.set(parsedData.data, { merge: true });
        
        return NextResponse.json({ success: true, message: 'Weather data updated.'}, { status: 200 });

    } catch (error: any) {
        console.error('Error updating weather data:', error);
        return NextResponse.json({ error: 'Failed to update weather data', details: error.message }, { status: 500 });
    }
}
