"use client";

import React, { useEffect } from "react";
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

const weatherConditions = {
  Sunny: { icon: <Sun className="h-6 w-6 text-yellow-500" />, name: "Sunny" },
  Rainy: { icon: <CloudRain className="h-6 w-6 text-blue-500" />, name: "Rainy" },
  Cloudy: { icon: <Cloudy className="h-6 w-6 text-gray-500" />, name: "Cloudy" },
};

type WeatherCondition = keyof typeof weatherConditions;

export function DashboardClient() {
  const [weather, setWeather] = React.useState<{ temp: number; condition: WeatherCondition; wind: number } | null>(null);

  useEffect(() => {
    // Mock fetching weather data
    const mockWeatherData = {
        temp: 18,
        condition: 'Sunny' as WeatherCondition,
        wind: 12,
    };
    setWeather(mockWeatherData);
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Temperature Card */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                {weather ? weatherConditions[weather.condition].icon : <Cloudy className="h-6 w-6 text-gray-500" />}
                <span>Temperature</span>
                </CardTitle>
                <CardDescription>London, UK</CardDescription>
            </CardHeader>
            <CardContent>
                {weather ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-6xl font-bold">{weather.temp}°C</div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Thermometer className="h-5 w-5" />
                            <span>{weatherConditions[weather.condition].name}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>Loading...</p>
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
                {weather ? (
                     <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-6xl font-bold">{weather.wind}</div>
                        <div className="text-sm text-muted-foreground">km/h</div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>Loading...</p>
                    </div>
                )}
            </CardContent>
        </Card>
      
      {/* Notification Log */}
      <Card className="lg:col-span-1">
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
