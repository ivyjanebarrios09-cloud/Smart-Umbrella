
export type WeatherCondition = "Sunny" | "Rainy" | "Cloudy" | "Partly cloudy";

export interface ForecastData {
  date: string;
  condition: WeatherCondition;
  temperature_max: number;
  temperature_min: number;
}
export interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  windspeed: number;
  timestamp: number;
  location: string;
  forecast: ForecastData[];
}
