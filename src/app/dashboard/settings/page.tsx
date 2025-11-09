
"use client";

import { useState } from "react";
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [bleStatus, setBleStatus] = useState<"connected" | "disconnected">("disconnected");
  const [leftBehindAlert, setLeftBehindAlert] = useState(false);

  const handleBleToggle = () => {
    setBleStatus(prev => prev === 'connected' ? 'disconnected' : 'connected');
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
                <div className="flex items-center gap-2 font-medium">
                  <Bluetooth className="h-5 w-5" />
                  <span>Bluetooth</span>
                </div>
                <Button onClick={handleBleToggle} variant={bleStatus === "connected" ? "secondary" : "default"}>
                  {bleStatus === "connected" ? "Disconnect" : "Connect"}
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
