"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  CloudRain,
  Cloudy,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { useDatabase, useMemoFirebase, useRtdbValue } from "@/firebase";
import { ref } from "firebase/database";
import { WeatherData, WeatherCondition } from "@/lib/types";


const weatherConditions = {
  Sunny: { icon: <Sun className="h-6 w-6 text-yellow-500" />, name: "Sunny" },
  Rainy: { icon: <CloudRain className="h-6 w-6 text-blue-500" />, name: "Rainy" },
  Cloudy: { icon: <Cloudy className="h-6 w-6 text-gray-500" />, name: "Cloudy" },
};


export function DashboardClient() {
  const database = useDatabase();
  
  const weatherRef = useMemoFirebase(() => {
    if (!database) return null;
    return ref(database, 'weather');
  }, [database]);

  const { data: weatherHistory, isLoading: isWeatherLoading } = useRtdbValue<{[key: string]: WeatherData}>(weatherRef);
  
  const latestWeather = useMemo(() => {
    if (!weatherHistory) return null;
    const allEntries = Object.values(weatherHistory);
    if (allEntries.length === 0) return null;
    // Assuming the last entry is the latest one.
    // A more robust solution might use timestamps if available.
    return allEntries.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
  }, [weatherHistory]);


  const displayCondition = latestWeather?.condition && weatherConditions[latestWeather.condition]
    ? latestWeather.condition
    : 'Cloudy';


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Temperature Card */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                {isWeatherLoading ? <Cloudy className="h-6 w-6 text-gray-500" /> : weatherConditions[displayCondition].icon}
                <span>Temperature</span>
                </CardTitle>
                <CardDescription>
                    {isWeatherLoading
                        ? 'Loading location...'
                        : latestWeather?.location || 'Unknown Location'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isWeatherLoading ? (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>Loading...</p>
                    </div>
                ) : latestWeather ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-6xl font-bold">{latestWeather.temperature?.toFixed(1)}°C</div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Thermometer className="h-5 w-5" />
                            <span>{weatherConditions[displayCondition].name}</span>
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
                    <Wind className="h-6 w-6" />
                    <span>Wind</span>
                </CardTitle>
                 <CardDescription>Current wind speed</CardDescription>
            </CardHeader>
            <CardContent>
                {isWeatherLoading ? (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>Loading...</p>
                    </div>
                ) : latestWeather ? (
                     <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-6xl font-bold">{latestWeather.windspeed?.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">km/h</div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>No wind data available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      
      {/* Notification Log */}
      <Card className="lg:col-span-3">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6" />
                <span>Notification History</span>
            </CardTitle>
            <CardDescription>Recent alerts</CardDescription>
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
