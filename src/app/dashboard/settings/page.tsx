

"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, Laptop, Moon, Sun, KeyRound, RefreshCw } from "lucide-react";
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Device } from '@/lib/types';
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const newDeviceFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  deviceId: z.string().min(1, { message: "Device ID is required." }),
});

type NewDeviceFormValues = z.infer<typeof newDeviceFormSchema>;


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [leftBehindAlert, setLeftBehindAlert] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const devicesRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/devices`);
  }, [firestore, user]);

  const { data: devices, isLoading: areDevicesLoading } = useCollection<Device>(devicesRef);
  
  const [isSyncing, setIsSyncing] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };
  
  const form = useForm<NewDeviceFormValues>({
    resolver: zodResolver(newDeviceFormSchema),
    defaultValues: {
      name: '',
      deviceId: '',
    },
  });

  async function onSubmit(data: NewDeviceFormValues) {
    if (!user || !devicesRef) return;

    addDocumentNonBlocking(devicesRef, {
      userId: user.uid,
      metadata: {
        name: data.name,
        deviceId: data.deviceId,
        model: 'UmbraGuard v1',
        createdAt: new Date(),
      },
      ledEnabled: false,
      leftBehindNotificationEnabled: true,
    });

    toast({
      title: "Device Registered",
      description: `"${data.name}" has been added.`,
    });
    form.reset();
  }
  
  const handleSyncWeather = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to sync weather.',
      });
      return;
    }
    
    setIsSyncing(true);

    try {
      const response = await fetch('/api/user-weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to sync weather data.');
      }
      
      toast({
        title: 'Weather Synced!',
        description: 'The latest weather data has been saved to your profile.',
      });

    } catch (error: any) {
      console.error('Error syncing weather data:', error);
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: error.message || 'Could not sync weather data.',
      });
    } finally {
      setIsSyncing(false);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="space-y-8">
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
              
              <Separator />
              
              {/* Data Sync */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                 <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label className="font-medium">Sync Weather Data</Label>
                    <p className="text-sm text-muted-foreground">Manually save the latest weather data to your account.</p>
                  </div>
                  <Button onClick={handleSyncWeather} disabled={isSyncing}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {isSyncing ? "Syncing..." : "Sync Now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Register New Device</CardTitle>
              <CardDescription>
                Provide a name and device ID to register your new device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., My Smart Device" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the device ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Register Device</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-6 w-6 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your device identifiers for configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Registered Devices</Label>
                {isUserLoading || areDevicesLoading ? (
                   <p className="text-sm text-muted-foreground">Loading devices...</p>
                ) : devices && devices.length > 0 ? (
                  <div className="space-y-4">
                    {devices.map(device => (
                      <div key={device.id} className="space-y-2">
                        <p className="text-sm font-medium">{device.metadata.name}</p>
                         <div className="flex gap-2">
                            <Input id={`deviceId-${device.id}`} value={device.metadata.deviceId || 'N/A'} readOnly />
                            <Button variant="outline" onClick={() => copyToClipboard(device.metadata.deviceId || '')}>Copy ID</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No devices registered for this user.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
