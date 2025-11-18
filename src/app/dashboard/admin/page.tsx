'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Database } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();

  const handleUpdateWeatherDoc = async () => {
    setIsLoading(true);
    try {
      const weatherDocRef = doc(firestore, 'weather/current');
      const newWeatherData = {
        latitude: 14.93339533,
        longitude: 120.6249533,
        location_str: "Sasmuan, Pampanga, Philippines",
        time: "10:00 PM",
        updatedAt: serverTimestamp(),
        temperature: 26.2,
        windspeed: 4.9,
        condition: 'Sunny',
        weathercode: 3, // Assuming Sunny maps to a code like 3 (Cloudy in old data) or similar
        forecast_daily_raw: "{\"time\":[\"2025-11-18\",\"2025-11-19\",\"2025-11-20\",\"2025-11-21\",\"2025-11-22\",\"2025-11-23\",\"2025-11-24\"],\"temperature_2m_max\":[32.7,32.7,33,32.8,33.4,33.4,34.8],\"temperature_2m_min\":[25.3,24.5,24.6,24.7,23.7,24.3,23.7],\"weathercode\":[3,3,3,2,2,2,2],\"precipitation_probability_max\":[25,15,11,18,6,5,13]}",
      };
      
      await setDoc(weatherDocRef, newWeatherData);

      toast({
        title: 'Success!',
        description: 'Public weather document has been updated.',
      });
    } catch (error: any) {
      console.error('Error updating weather document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.message || 'Could not update the weather document.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Admin Actions
            </CardTitle>
            <CardDescription>
              Use these actions for one-time database setup or updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <h3 className="font-semibold">Update Public Weather Data</h3>
                <p className="text-sm text-muted-foreground">
                  Click this button to update the public `weather/current` document
                  with the latest data from Sasmuan, Pampanga.
                </p>
                <Button
                  onClick={handleUpdateWeatherDoc}
                  disabled={isLoading}
                  className="mt-2 w-full sm:w-auto"
                >
                  {isLoading ? 'Updating...' : 'Update Weather Document'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
