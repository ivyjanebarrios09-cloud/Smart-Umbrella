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
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { WeatherData, WeatherCondition } from "@/lib/types";


const weatherConditions = {
  Sunny: { icon: <Sun className="h-6 w-6 text-yellow-500" />, name: "Sunny" },
  Rainy: { icon: <CloudRain className="h-6 w-6 text-blue-500" />, name: "Rainy" },
  Cloudy: { icon: <Cloudy className="h-6 w-6 text-gray-500" />, name: "Cloudy" },
  // Add other conditions as needed
};


type ForecastDay = {
  day: string;
  condition: WeatherCondition;
  temp: number;
};

export function DashboardClient() {
  const firestore = useFirestore();
  
  const weatherDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'weather', 'latest');
  }, [firestore]);

  const { data: weather, isLoading: isWeatherLoading } = useDoc<WeatherData>(weatherDocRef);
  const [forecast, setForecast] = React.useState<ForecastDay[] | null>(null);


  useEffect(() => {
    // Mock forecast data until a real source is available
    const mockForecast: ForecastDay[] = [
      { day: "Mon", condition: "Sunny", temp: 20 },
      { day: "Tue", condition: "Cloudy", temp: 18 },
      { day: "Wed", condition: "Rainy", temp: 16 },
      { day: "Thu", condition: "Sunny", temp: 22 },
      { day: "Fri", condition: "Cloudy", temp: 21 },
      { day: "Sat", condition: "Sunny", temp: 23 },
      { day: "Sun", condition: "Rainy", temp: 19 },
    ];
    setForecast(mockForecast);

  }, []);

  const displayCondition = weather?.condition && weatherConditions[weather.condition]
    ? weather.condition
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
                <CardDescription>London, UK</CardDescription>
            </CardHeader>
            <CardContent>
                {isWeatherLoading ? (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>Loading...</p>
                    </div>
                ) : weather ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-6xl font-bold">{weather.temperature?.toFixed(1)}°C</div>
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
                ) : weather ? (
                     <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-6xl font-bold">{weather.windspeed?.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">km/h</div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p>No wind data available.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Weather Forecast Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
            <CardDescription>Upcoming weather</CardDescription>
          </CardHeader>
          <CardContent>
            {forecast ? (
              <div className="space-y-4">
                {forecast.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="font-medium">{day.day}</span>
                    <div className="flex items-center gap-2">
                      {weatherConditions[day.condition].icon}
                      <span>{day.temp}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground">
                  <p>Loading forecast...</p>
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
