
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, Bluetooth, Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [bleDevice, setBleDevice] = useState<BluetoothDevice | null>(null);
  const [bleServer, setBleServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [leftBehindAlert, setLeftBehindAlert] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    return () => {
      // Disconnect on component unmount
      if (bleServer && bleServer.connected) {
        bleServer.disconnect();
      }
    };
  }, [bleServer]);
  
  const onDisconnected = () => {
    setIsConnected(false);
    setBleDevice(null);
    setBleServer(null);
    toast({
      title: "Bluetooth Disconnected",
      description: "Your device has been disconnected.",
    });
  };


  const handleBleToggle = async () => {
    if (!navigator.bluetooth) {
      toast({
        variant: "destructive",
        title: "Web Bluetooth Not Supported",
        description: "Your browser doesn't support Web Bluetooth. Please use a compatible browser like Chrome.",
      });
      return;
    }

    if (isConnected && bleServer) {
      bleServer.disconnect();
      return;
    }
    
    setIsConnecting(true);
    try {
      // For the purpose of this demo, we'll filter for any device that has a "generic_access" service.
      // For a real product, you'd use a custom service UUID specific to your ESP32 firmware.
      // Example custom service UUID: '48b43297-2993-4e49-813c-c2f6d89a421b'
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // For easier testing, accepts any device.
        // optionalServices: ['generic_access'] // Use this line in production
      });
      
      if (!device) {
        toast({
            variant: "destructive",
            title: "No device selected",
        });
        setIsConnecting(false);
        return;
      }
      
      setBleDevice(device);
      
      toast({
        title: "Connecting...",
        description: `Attempting to connect to ${device.name || `ID: ${device.id}`}`,
      });

      const server = await device.gatt?.connect();

      if (!server) {
        toast({
            variant: "destructive",
            title: "Connection Failed",
            description: "Could not connect to the device's GATT server.",
        });
        setIsConnecting(false);
        return;
      }
      
      setBleServer(server);
      setIsConnected(true);
      device.addEventListener('gattserverdisconnected', onDisconnected);

      toast({
        title: "Bluetooth Connected",
        description: `Successfully connected to ${device.name || `ID: ${device.id}`}.`,
      });

    } catch (error: any) {
      if (error.name === 'NotFoundError') {
         toast({
          title: "No Device Found",
          description: "No Bluetooth devices found. Make sure your device is on and in range.",
        });
      } else {
        toast({
            variant: "destructive",
            title: "Connection Error",
            description: error.message || "An unknown error occurred during connection.",
        });
      }
    } finally {
        setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your application settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appearance</h3>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <Label htmlFor="theme" className="font-medium">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4"/>
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4"/>
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4"/>
                        <span>System</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Connectivity Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connectivity</h3>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-medium">
                        <Bluetooth className="h-5 w-5" />
                        <span>Bluetooth</span>
                    </div>
                     <span className="text-sm text-muted-foreground">
                        {isConnected && bleDevice ? `Connected to ${bleDevice.name || bleDevice.id}` : "Not Connected"}
                    </span>
                </div>
                <Button onClick={handleBleToggle} variant={isConnected ? "secondary" : "default"} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : (isConnected ? "Disconnect" : "Connect")}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Alert Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <Label htmlFor="left-behind-alert" className="font-medium">Left-Behind Alert</Label>
                <Switch
                  id="left-behind-alert"
                  checked={leftBehindAlert}
                  onCheckedChange={setLeftBehindAlert}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
