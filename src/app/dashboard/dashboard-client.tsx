
'use client';

import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bell,
  Calendar,
  CloudRain,
  Cloudy,
  MapPin,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { WeatherData, WeatherCondition, DailyForecast } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

const getWeatherConditionFromCode = (code: number): WeatherCondition => {
  if (code <= 1) return 'Sunny';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Cloudy';
  if (code >= 51 && code <= 67) return 'Rain';
  if (code >= 80 && code <= 82) return 'Rain';
  return 'Cloudy';
};

const getDayOfWeek = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ).toLocaleDateString('en-US', { weekday: 'short' });
};

export function DashboardClient() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [refreshKey, setRefreshKey] = useState(0);

  const weatherQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/weather`),
      orderBy('updatedAt', 'desc'),
      limit(1)
    );
  }, [firestore, user, refreshKey]);

  const { data: weatherData, isLoading: isWeatherLoading } =
    useCollection<WeatherData>(weatherQuery);
    
  const handleRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  const latestWeather = useMemo(() => (weatherData && weatherData.length > 0 ? weatherData[0] : null), [weatherData]);

  const forecastArray: DailyForecast[] | null = useMemo(() => {
    if (!latestWeather?.forecast_daily_raw) return null;

    try {
      const forecastData = JSON.parse(latestWeather.forecast_daily_raw);
      
      if (
        !forecastData.time ||
        !forecastData.weathercode ||
        !forecastData.temperature_2m_max ||
        !forecastData.temperature_2m_min
      ) {
        return null;
      }
      
      return forecastData.time.map((date: string, index: number) => ({
        date,
        weathercode: forecastData.weathercode[index],
        condition: getWeatherConditionFromCode(forecastData.weathercode[index]),
        temperature_max: forecastData.temperature_2m_max[index],
        temperature_min: forecastData.temperature_2m_min[index],
      }));
    } catch (error) {
      console.error("Failed to parse forecast JSON:", error);
      return null;
    }
  }, [latestWeather]);


  const currentTemperature = latestWeather?.temperature;
  const currentWindspeed = latestWeather?.windspeed;
  const currentConditionName = latestWeather?.condition ?? 'Cloudy';
  const displayCondition = weatherConditions[currentConditionName];

  const mapSrc = useMemo(() => {
    if (latestWeather?.latitude && latestWeather?.longitude) {
      return `https://maps.google.com/maps?q=${latestWeather.latitude},${latestWeather.longitude}&hl=es;z=14&output=embed`;
    }
    return '';
  }, [latestWeather]);

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${isWeatherLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Temperature Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-6 w-6 text-primary" />
              <span>Temperature</span>
            </CardTitle>
            <CardDescription>
              {isWeatherLoading
                ? 'Loading location...'
                : latestWeather?.location_str || 'Unknown Location'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isWeatherLoading ? (
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
                  <span>{displayCondition?.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground">
                <p>No weather data available.</p>
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
            {isWeatherLoading ? (
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
            {isWeatherLoading ? (
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

        {/* 7-Day Forecast Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span>7-Day Forecast</span>
            </CardTitle>
            <CardDescription>Upcoming weather at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            {isWeatherLoading ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p>Loading forecast...</p>
              </div>
            ) : forecastArray && forecastArray.length > 0 ? (
              <ul className="space-y-4">
                {forecastArray.map((day, index) => {
                  const conditionIcon =
                    weatherConditions[
                      day.condition as keyof typeof weatherConditions
                    ]?.icon || <Cloudy className="h-6 w-6 text-gray-400" />;
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="font-semibold w-12">
                        {getDayOfWeek(day.date)}
                      </span>
                      <span className="flex-shrink-0">{conditionIcon}</span>
                      <span className="w-20 text-right text-muted-foreground">
                        {day.temperature_max.toFixed(0)}° /{' '}
                        {day.temperature_min.toFixed(0)}°
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p>No forecast data available.</p>
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
    </>
  );
}
