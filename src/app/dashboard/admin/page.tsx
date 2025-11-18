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

  const handleCreateWeatherDoc = async () => {
    setIsLoading(true);
    try {
      const weatherDocRef = doc(firestore, 'weather/current');
      const defaultWeatherData = {
        latitude: 34.0522,
        longitude: -118.2437,
        location_str: "Los Angeles, CA",
        time: new Date().toISOString(),
        updatedAt: serverTimestamp(),
        temperature: 18,
        windspeed: 5.5,
        condition: 'Sunny',
        weathercode: 1,
        forecast_daily_raw: JSON.stringify({
            "time": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"],
            "weathercode": [2, 3, 61, 61, 3, 2, 1],
            "temperature_2m_max": [18, 17, 16, 15, 17, 18, 19],
            "temperature_2m_min": [10, 9, 8, 8, 9, 10, 11]
        }),
      };
      
      await setDoc(weatherDocRef, defaultWeatherData);

      toast({
        title: 'Success!',
        description: 'Initial weather document created at "weather/current".',
      });
    } catch (error: any) {
      console.error('Error creating weather document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.message || 'Could not create the weather document.',
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
              Use these actions for one-time database setup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <h3 className="font-semibold">Initialize Weather Data</h3>
                <p className="text-sm text-muted-foreground">
                  Click this button to create the first document in the `weather`
                  collection. This is needed for the dashboard to show data.
                </p>
                <Button
                  onClick={handleCreateWeatherDoc}
                  disabled={isLoading}
                  className="mt-2 w-full sm:w-auto"
                >
                  {isLoading ? 'Creating...' : 'Create Weather Document'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
