
"use client";

import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { collection } from "firebase/firestore";
import type { Device } from "@/lib/types";
import { Bell } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AlertPage() {
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();

  const devicesRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/devices`);
  }, [firestore, user]);

  const { data: devices, isLoading: areDevicesLoading } = useCollection<Device>(devicesRef);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error("Not signed in");
      if (!selectedDevice) throw new Error("Please select a device.");
      
      const idToken = await user.getIdToken();

      const response = await fetch("/api/trigger-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: idToken,
          deviceId: selectedDevice,
          message: "Left-behind alert triggered from app!",
          type: "left_behind",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to send alert.");
      }

      toast({
        title: "Alert Sent!",
        description: "The alert has been logged and sent to your device.",
      });

    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Send Device Alert
            </CardTitle>
            <CardDescription>
              Select a device to send a "left-behind" notification to.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedDevice} value={selectedDevice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a device..." />
              </SelectTrigger>
              <SelectContent>
                {areDevicesLoading ? (
                  <SelectItem value="loading" disabled>Loading devices...</SelectItem>
                ) : devices && devices.length > 0 ? (
                  devices.map(device => (
                    <SelectItem key={device.id} value={device.metadata.deviceId}>
                      {device.metadata.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-devices" disabled>No devices registered.</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button onClick={onSubmit} disabled={loading || !selectedDevice || areDevicesLoading} className="w-full">
              {loading ? "Sending Alert..." : "Send Alert"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
