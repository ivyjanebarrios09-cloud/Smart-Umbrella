
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
  Calendar,
  CloudRain,
  Cloudy,
  MapPin,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { useDatabase, useMemoFirebase } from "@/firebase";
import { useRtdbValue } from "@/firebase/rtdb/use-rtdb-value";
import { ref } from "firebase/database";
import { WeatherData, WeatherCondition, DailyForecast } from "@/lib/types";

const weatherConditions: Record<string, { icon: JSX.Element, name: string }> = {
  Sunny: { icon: <Sun className="h-6 w-6 text-yellow-500" />, name: "Sunny" },
  Rainy: { icon: <CloudRain className="h-6 w-6 text-blue-500" />, name: "Rainy" },
  Cloudy: { icon: <Cloudy className="h-6 w-6 text-gray-500" />, name: "Cloudy" },
  "Partly cloudy": { icon: <Cloudy className="h-6 w-6 text-gray-400" />, name: "Partly cloudy" },
};

const getWeatherConditionFromCode = (code: number): WeatherCondition => {
    if (code <= 1) return "Sunny";
    if (code === 2) return "Partly cloudy";
    if (code === 3) return "Cloudy";
    if (code >= 51 && code <= 67) return "Rainy"; 
    if (code >= 80 && code <= 82) return "Rainy";
    return "Cloudy";
}

const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
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
    // Find the entry with the highest timestamp
    return allEntries.reduce((latest, current) => {
      const latestTime = latest?.timestamp_ms ?? 0;
      const currentTime = current?.timestamp_ms ?? 0;
      return currentTime > latestTime ? current : latest;
    }, allEntries[0]);
  }, [weatherHistory]);

  const currentTemperature = latestWeather?.current?.temperature;
  const currentWindspeed = latestWeather?.current?.windspeed;
  const currentConditionName = latestWeather?.current?.condition || "Cloudy";
  const displayCondition = weatherConditions[currentConditionName];
  
  const forecastArray: DailyForecast[] | null = useMemo(() => {
    if (!latestWeather || !latestWeather.forecast) return null;
    
    const { time, weathercode, temperature_2m_max, temperature_2m_min } = latestWeather.forecast;
    
    if (time && weathercode && temperature_2m_max && temperature_2m_min) {
        return time.map((date: string, index: number) => ({
            date,
            weathercode: weathercode[index],
            condition: getWeatherConditionFromCode(weathercode[index]),
            temperature_max: temperature_2m_max[index],
            temperature_min: temperature_2m_min[index],
        }));
    }

    return null;
  }, [latestWeather]);

  const mapSrc = useMemo(() => {
    if (latestWeather?.latitude && latestWeather?.longitude) {
      return `https://maps.google.com/maps?q=${latestWeather.latitude},${latestWeather.longitude}&hl=es;z=14&output=embed`;
    }
    return "";
  }, [latestWeather]);


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

        {/* Map Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Last Known Location</span>
            </CardTitle>
            <CardDescription>GPS coordinates of the umbrella</CardDescription>
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
        <Card className="lg:col-span-3">
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
                            const conditionIcon = weatherConditions[day.condition as keyof typeof weatherConditions]?.icon || <Cloudy className="h-6 w-6 text-gray-400" />;
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
    </div>
  );
}
