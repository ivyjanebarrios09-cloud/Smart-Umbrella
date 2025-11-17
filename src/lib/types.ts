
import { Timestamp } from 'firebase/firestore';

export type WeatherCondition = "Sunny" | "Rain" | "Cloudy" | "Partly cloudy";

export interface DailyForecast {
  date: string;
  condition: WeatherCondition;
  temperature_max: number;
  temperature_min: number;
  weathercode: number;
}

// This type represents the structure of the `forecast` field when it's an object of arrays
export interface RawForecastObject {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  location_str: string;
  time?: string;
  updatedAt?: number | Timestamp;
  temperature?: number;
  windspeed?: number;
  condition?: WeatherCondition;
  weathercode?: number;
  forecast_daily_raw?: string;
  current?: {
    temperature: number;
    windspeed: number;
    condition: WeatherCondition;
    weathercode: number;
  };
}

export interface NotificationLog {
    id: string;
    userId: string;
    deviceId?: string;
    type: 'left_behind' | 'weather_alert' | string;
    message: string;
    timestamp: Timestamp;
}


export interface Device {
  id: string;
  userId: string;
  metadata: {
    name: string;
    deviceId: string;
    model?: string;
    createdAt?: Timestamp;
  };
  currentWeather?: {
    condition?: WeatherCondition;
    temperature?: number;
    windspeed?: number;
    location_str?: string;
    latitude?: number;
    longitude?: number;
    forecast_daily_raw?: string;
    updatedAt?: Timestamp;
  };
  ledEnabled?: boolean;
  leftBehindNotificationEnabled?: boolean;
}

export interface UmbrellaActivity {
  id: string;
  condition?: string;
  temperature?: number;
  windspeed?: number;
  location?: string;
  time: string;
}

    

    
