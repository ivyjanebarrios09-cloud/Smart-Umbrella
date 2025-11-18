
'use server';

import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import type { WeatherData } from '@/lib/types';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = getFirestore();

const userWeatherSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
});

/**
 * @description Syncs the latest public weather data to a specific user's profile.
 * This is triggered by the user from the settings page.
 * @method POST
 */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedData = userWeatherSchema.safeParse(json);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { userId } = parsedData.data;

    // 1. Fetch the latest public weather data
    const publicWeatherRef = db.doc('weather/current');
    const publicWeatherSnap = await publicWeatherRef.get();

    if (!publicWeatherSnap.exists) {
      throw new Error('Could not find current weather data to sync.');
    }

    const sourceData = publicWeatherSnap.data() as WeatherData;

    // 2. Prepare the data to be saved to the user's subcollection
    const dataToSave = {
      latitude: sourceData.latitude,
      longitude: sourceData.longitude,
      location_str: sourceData.location_str,
      time: sourceData.time,
      updatedAt: FieldValue.serverTimestamp(), // Use server timestamp for reliable ordering
      temperature: sourceData.current?.temperature ?? 0,
      windspeed: sourceData.current?.windspeed ?? 0,
      condition: sourceData.current?.condition ?? 'Cloudy',
      weathercode: sourceData.current?.weathercode ?? 3,
      forecast_daily_raw: sourceData.forecast_daily_raw,
    };

    // 3. Save the new weather document to the user's weather subcollection
    const userWeatherCollectionRef = db.collection(`users/${userId}/weather`);
    const newDocRef = await userWeatherCollectionRef.add(dataToSave);

    return NextResponse.json(
      { success: true, message: 'Weather data synced.', documentId: newDocRef.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error syncing user weather data:', error);
    if (error.code === 'permission-denied') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        );
    }
    return NextResponse.json(
      { error: 'Failed to sync weather data', details: error.message },
      { status: 500 }
    );
  }
}
