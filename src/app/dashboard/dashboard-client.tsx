"use client";

import React from "react";
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
  Sunny: <Sun className="h-6 w-6 text-yellow-500" />,
  Rainy: <CloudRain className="h-6 w-6 text-blue-500" />,
  Cloudy: <Cloudy className="h-6 w-6 text-gray-500" />,
};

type WeatherCondition = keyof typeof weatherConditions;

export function DashboardClient() {
  const [weather, setWeather] = React.useState<{ temp: number; condition: WeatherCondition; wind: number } | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weather Card */}
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                {weather ? weatherConditions[weather.condition] : <Cloudy className="h-6 w-6 text-gray-500" />}
                <span>Today's Weather</span>
                </CardTitle>
                <CardDescription>London, UK</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {weather ? (
                    <>
                        <div className="flex items-center justify-center text-6xl font-bold">
                            {weather.temp}°C
                        </div>
                        <div className="flex justify-around text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4" />
                                <span>{weather.condition}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wind className="h-4 w-4" />
                                <span>{weather.wind} km/h</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>No weather data available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      
      {/* Notification Log */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6" />
                <span>Notification History</span>
            </CardTitle>
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
