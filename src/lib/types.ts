
export type WeatherCondition = "Sunny" | "Rainy" | "Cloudy";

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  windspeed: number;
  timestamp: number;
  location: string;
}
