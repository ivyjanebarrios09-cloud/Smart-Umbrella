
'use client';

import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bell,
  CloudRain,
  Cloudy,
  MapPin,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, limit, query } from 'firebase/firestore';
import { WeatherCondition, Device } from '@/lib/types';
import Link from 'next/link';

const weatherConditions: Record<
  WeatherCondition,
  { icon: JSX.Element; name: string }
> = {
  Sunny: { icon: <Sun className="h-6 w-6 text-yellow-500" />, name: 'Sunny' },
  Rain: { icon: <CloudRain className="h-6 w-6 text-blue-500" />, name: 'Rain' },
  Cloudy: { icon: <Cloudy className="h-6 w-6 text-gray-500" />, name: 'Cloudy' },
  'Partly cloudy': {
    icon: <Cloudy className="h-6 w-6 text-gray-400" />,
    name: 'Partly cloudy',
  },
};

export function DashboardClient() {
  const { user } = useUser();
  const firestore = useFirestore();

  const devicesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/devices`),
      limit(1)
    );
  }, [firestore, user]);

  const { data: devices, isLoading: areDevicesLoading } =
    useCollection<Device>(devicesQuery);
    
  const device = devices?.[0];

  const currentTemperature = device?.temperature;
  const currentWindspeed = device?.windspeed;
  const currentConditionName = device?.condition ?? 'Cloudy';
  const displayCondition = weatherConditions[currentConditionName];
  const location = device?.location;
  const time = device?.time;

  const mapSrc = useMemo(() => {
    if (device?.latitude && device?.longitude) {
      return `https://maps.google.com/maps?q=${device.latitude},${device.longitude}&hl=es;z=14&output=embed`;
    }
    return '';
  }, [device]);


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Temperature Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-6 w-6 text-primary" />
            <span>Temperature</span>
          </CardTitle>
          <CardDescription>
            {areDevicesLoading
              ? 'Loading location...'
              : location || 'Unknown Location'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {areDevicesLoading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              <p>Loading...</p>
            </div>
          ) : currentTemperature !== undefined ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-6xl font-bold">
                {currentTemperature.toFixed(1)}°C
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {displayCondition?.icon}
                <span>{displayCondition?.name} at {time}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              <p>No weather data available for this device.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wind Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-primary" />
            <span>Wind</span>
          </CardTitle>
          <CardDescription>Current wind speed</CardDescription>
        </CardHeader>
        <CardContent>
          {areDevicesLoading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              <p>Loading...</p>
            </div>
          ) : currentWindspeed !== undefined ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-6xl font-bold">
                {currentWindspeed.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">km/h</div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              <p>No wind data available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span>Last Known Location</span>
          </CardTitle>
          <CardDescription>GPS coordinates of the device</CardDescription>
        </CardHeader>
        <CardContent>
          {areDevicesLoading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>Loading map...</p>
            </div>
          ) : mapSrc ? (
            <div className="aspect-video overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src={mapSrc}
              ></iframe>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>No location data available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Log */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <span>Notification History</span>
          </CardTitle>
           <CardDescription>
            <Link href="/dashboard/notifications" className="hover:underline">
              Recent alerts. Click to see all.
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            <p>No notifications yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    