
export type WeatherCondition = "Sunny" | "Rainy" | "Cloudy" | "Partly cloudy";

export interface DailyForecast {
  date: string;
  condition: WeatherCondition;
  temperature_max: number;
  temperature_min: number;
  weathercode: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  location_str: string;
  timestamp_ms: number;
  current: {
    temperature: number;
    windspeed: number;
    condition: WeatherCondition;
  };
  forecast: DailyForecast[];
}
