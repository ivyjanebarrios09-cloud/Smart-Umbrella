
'use client';

import { useState, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Device } from '@/lib/types';

export default function AlertPage() {
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  const { user } = useUser();
  const firestore = useFirestore();

  const devicesRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/devices`);
  }, [firestore, user]);

  const { data: devices } = useCollection<Device>(devicesRef);

  const selectedDeviceInfo = useMemo(() => {
    return devices?.find((d) => d.id === selectedDevice);
  }, [devices, selectedDevice]);


  const onSubmit = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Signed In',
        description: 'Please log in to send an alert.',
      });
      return;
    }

    if (!selectedDeviceInfo) {
      toast({
        variant: 'destructive',
        title: 'No Device Selected',
        description: 'Please select your umbrella first.',
      });
      return;
    }

    setLoading(true);

    try {
      const idToken = await user.getIdToken();

      const response = await fetch('/api/trigger-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: idToken,
          deviceId: selectedDeviceInfo.id,
          message: `Alert triggered for ${selectedDeviceInfo.metadata.name}`,
          type: 'custom',
        }),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {}

      if (!response.ok) {
        console.error('Trigger API failed:', response.status, text);
        const msg =
          data?.error ||
          data?.details ||
          data?.message ||
          `Server error ${response.status}`;
        throw new Error(msg);
      }

      toast({
        title: 'Alert Sent!',
        description: 'Your umbrella should be buzzing and flashing right now!',
      });
    } catch (err: any) {
      console.error('Failed to trigger alert:', err);
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: err.message || 'Could not reach your umbrella.',
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
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Ring Your Umbrella</CardTitle>
            <CardDescription>
              Trigger the buzzer + LED on your smart umbrella instantly
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Device</label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a device..." />
                </SelectTrigger>
                <SelectContent>
                  {devices && devices.length > 0 ? (
                    devices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.metadata.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-devices" disabled>
                      No devices registered
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={onSubmit}
              disabled={loading || !user || !selectedDevice}
              size="lg"
              className="w-full text-lg font-semibold"
            >
              {loading ? <>Sending Alert...</> : <>Ring My Umbrella Now!</>}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Your umbrella will buzz and flash for 5 seconds when triggered.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
