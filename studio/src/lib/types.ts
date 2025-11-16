import { Timestamp } from 'firebase/firestore';

export type WeatherCondition = "Sunny" | "Rain" | "Cloudy" | "Partly cloudy";

export interface DailyForecast {
  date: string;
  condition: WeatherCondition;
  temperature_max: number;
  temperature_min: number;
  weathercode: number;
}

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
    weathercode: number;
  };
  forecast_daily_raw?: string;
}

export interface Umbrella {
  id: string;
  name: string;
}
    
export interface NotificationLog {
  id: string;
  userId: string;
  umbrellaId?: string;
  type: 'left_behind' | 'weather_alert' | string;
  message: string;
  timestamp: Timestamp;
}
