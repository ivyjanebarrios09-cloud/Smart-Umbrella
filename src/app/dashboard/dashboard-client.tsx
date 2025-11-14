
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
  Calendar,
  CloudRain,
  Cloudy,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { useDatabase, useMemoFirebase } from "@/firebase";
import { useRtdbValue } from "@/firebase/rtdb/use-rtdb-value";
import { ref } from "firebase/database";
import { WeatherData, WeatherCondition, DailyForecast } from "@/lib/types";


const weatherConditions: Record<WeatherCondition, { icon: JSX.Element, name: string }> = {
  Sunny: { icon: <Sun className="h-6 w-6 text-yellow-500" />, name: "Sunny" },
  Rainy: { icon: <CloudRain className="h-6 w-6 text-blue-500" />, name: "Rainy" },
  Cloudy: { icon: <Cloudy className="h-6 w-6 text-gray-500" />, name: "Cloudy" },
  "Partly cloudy": { icon: <Cloudy className="h-6 w-6 text-gray-400" />, name: "Partly cloudy" },
};

const getWeatherConditionFromCode = (code: number): WeatherCondition => {
    // Weather code interpretation based on WMO codes
    if (code <= 1) return "Sunny";
    if (code === 2) return "Partly cloudy";
    if (code === 3) return "Cloudy";
    if (code >= 51 && code <= 67) return "Rainy"; // Drizzle/Rain
    if (code >= 80 && code <= 82) return "Rainy"; // Rain showers
    return "Cloudy"; // Default for other codes
}


const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    // Use UTC date parts to avoid timezone shifts affecting the displayed day
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toLocaleDateString('en-US', { weekday: 'short' });
}

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
    // Find the entry with the most recent timestamp
    return allEntries.sort((a, b) => (b.timestamp_ms || 0) - (a.timestamp_ms || 0))[0];
  }, [weatherHistory]);

  const currentTemperature = latestWeather?.temperature_2m_max?.[0];
  const currentWindspeed = latestWeather?.windspeed_10m_max?.[0];
  const currentConditionCode = latestWeather?.weathercode?.[0];
  const currentConditionName = currentConditionCode !== undefined ? getWeatherConditionFromCode(currentConditionCode) : "Cloudy";
  const displayCondition = weatherConditions[currentConditionName];

  const forecastArray: DailyForecast[] = useMemo(() => {
    if (!latestWeather || !latestWeather.time || !latestWeather.weathercode || !latestWeather.temperature_2m_max || !latestWeather.temperature_2m_min) return [];
    
    return latestWeather.time.map((date, index) => ({
        date,
        weathercode: latestWeather.weathercode[index],
        condition: getWeatherConditionFromCode(latestWeather.weathercode[index]),
        temperature_max: latestWeather.temperature_2m_max[index],
        temperature_min: latestWeather.temperature_2m_min[index],
    }));

  }, [latestWeather]);


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Temperature Card */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                {isWeatherLoading ? <Cloudy className="h-6 w-6 text-gray-500" /> : displayCondition?.icon}
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
                        <div className="text-6xl font-bold">{currentTemperature.toFixed(1)}°C</div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Thermometer className="h-5 w-5" />
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
                ) : currentWindspeed !== undefined ? (
                     <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-6xl font-bold">{currentWindspeed.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">km/h</div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>No wind data available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      
        {/* 7-Day Forecast Card */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    <span>7-Day Forecast</span>
                </CardTitle>
                <CardDescription>Upcoming weather at a glance</CardDescription>
            </CardHeader>
            <CardContent>
                {isWeatherLoading ? (
                     <div className="flex items-center justify-center h-48 text-muted-foreground">
                        <p>Loading forecast...</p>
                    </div>
                ) : forecastArray.length > 0 ? (
                    <ul className="space-y-4">
                        {forecastArray.map((day, index) => {
                            const conditionIcon = weatherConditions[day.condition]?.icon || <Cloudy className="h-6 w-6 text-gray-400" />;
                            return (
                                <li key={index} className="flex items-center justify-between">
                                    <span className="font-semibold w-12">{getDayOfWeek(day.date)}</span>
                                    <span className="flex-shrink-0">{conditionIcon}</span>
                                    <span className="w-20 text-right text-muted-foreground">{day.temperature_max.toFixed(0)}° / {day.temperature_min.toFixed(0)}°</span>
                                </li>
                            )
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
