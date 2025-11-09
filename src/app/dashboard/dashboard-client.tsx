"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  CloudRain,
  Cloudy,
  Lightbulb,
  MapPin,
  Settings,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const weatherConditions = {
  Sunny: <Sun className="h-6 w-6 text-yellow-500" />,
  Rainy: <CloudRain className="h-6 w-6 text-blue-500" />,
  Cloudy: <Cloudy className="h-6 w-6 text-gray-500" />,
};

type WeatherCondition = keyof typeof weatherConditions;

const mockNotifications = [
    { id: 1, icon: <MapPin className="h-4 w-4" />, text: "Umbrella left behind at 'Office'", time: "2 hours ago" },
    { id: 2, icon: <CloudRain className="h-4 w-4" />, text: "Rain expected in 30 minutes. Don't forget your umbrella!", time: "8 hours ago" },
    { id: 3, icon: <Bluetooth className="h-4 w-4" />, text: "Umbrella successfully connected.", time: "1 day ago" },
];


export function DashboardClient() {
  const [bleStatus, setBleStatus] = useState<"connected" | "disconnected" | "scanning">("connected");
  const [isLedOn, setIsLedOn] = useState(false);
  const [weather, setWeather] = useState<{ temp: number; condition: WeatherCondition; wind: number }>({
    temp: 18,
    condition: "Rainy",
    wind: 12
  });
  const [leftBehindAlert, setLeftBehindAlert] = useState(true);
  const [sensitivity, setSensitivity] = useState([50]);
  const [rainAlert, setRainAlert] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    if (bleStatus === 'disconnected') {
      const timer = setTimeout(() => {
          if(leftBehindAlert) {
            toast({
              title: "Umbrella Left Behind!",
              description: "You seem to have left your UmbraGuard behind.",
              variant: "destructive",
            });
          }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bleStatus, leftBehindAlert, toast]);

  const handleBleToggle = () => {
      if (bleStatus === 'connected') {
          setBleStatus('disconnected');
      } else {
          setBleStatus('scanning');
          setTimeout(() => setBleStatus('connected'), 3000);
      }
  }

  const handleFind = () => {
    toast({
        title: "Finding Umbrella...",
        description: "Your umbrella's LED is now flashing.",
      });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weather Card */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                {weatherConditions[weather.condition]}
                <span>Today's Weather</span>
                </CardTitle>
                <CardDescription>London, UK</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
        </Card>

      {/* Umbrella Control Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Umbrella Control</CardTitle>
          <CardDescription>Manage your smart umbrella's features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">Bluetooth Status</span>
            <Badge variant={bleStatus === "connected" ? "default" : "secondary"} className={`transition-colors ${bleStatus === "connected" ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30" : ""}`}>
                {bleStatus === "connected" && <BluetoothConnected className="mr-2 h-4 w-4" />}
                {bleStatus === "disconnected" && <Bluetooth className="mr-2 h-4 w-4" />}
                {bleStatus === "scanning" && <BluetoothSearching className="mr-2 h-4 w-4 animate-pulse" />}
                {bleStatus.charAt(0).toUpperCase() + bleStatus.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Handle LED</span>
            <div className="flex items-center gap-2">
                <Lightbulb className={`h-5 w-5 transition-colors ${isLedOn ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                <Switch checked={isLedOn} onCheckedChange={setIsLedOn} />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleBleToggle}>
                {bleStatus === 'connected' ? 'Disconnect' : 'Connect'}
            </Button>
            <Button onClick={handleFind} disabled={bleStatus !== 'connected'}>
                <MapPin className="mr-2 h-4 w-4" /> Find
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Settings Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <span>Alert Settings</span>
          </CardTitle>
          <CardDescription>Customize your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <label htmlFor="left-behind-alert" className="font-medium">Left-Behind Alert</label>
                <Switch id="left-behind-alert" checked={leftBehindAlert} onCheckedChange={setLeftBehindAlert} />
            </div>
            <div className="space-y-2">
                <label className="font-medium">Detection Sensitivity</label>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Near</span>
                    <Slider value={sensitivity} onValueChange={setSensitivity} max={100} step={1} disabled={!leftBehindAlert} />
                    <span>Far</span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="rain-alert" className="font-medium">Weather Alert</label>
                <Switch id="rain-alert" checked={rainAlert} onCheckedChange={setRainAlert} />
            </div>
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
            <div className="space-y-4">
                {mockNotifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4">
                        <div className="mt-1 text-muted-foreground">{notification.icon}</div>
                        <div className="flex-1">
                            <p className="text-sm">{notification.text}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
