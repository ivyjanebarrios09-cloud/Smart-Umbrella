import { Timestamp } from 'firebase/firestore';

export type WeatherCondition = "Sunny" | "Rainy" | "Cloudy" | "Partly cloudy";

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
  timestamp_ms: number;
  time_str?: string;
  current?: {
    temperature: number;
    windspeed: number;
    condition: WeatherCondition;
  };
  forecast_daily_raw?: string; // Changed from forecast
}

export interface NotificationLog {
    id: string;
    userId: string;
    umbrellaId?: string;
    type: 'left_behind' | 'weather_alert' | string;
    message: string;
    timestamp: Timestamp;
}
