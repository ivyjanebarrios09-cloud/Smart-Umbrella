
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
import { Bell, ArrowLeft, Lightbulb, Volume2 } from 'lucide-react';
import Link from 'next/link';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import type { Device } from '@/lib/types';
import { Label } from '@/components/ui/label';

export default function AlertPage() {
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('esp32-1'); // Default to esp32-1

  const { user } = useUser();
  const firestore = useFirestore();

  const devicesRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/devices`);
  }, [firestore, user]);

  const { data: devices } = useCollection<Device>(devicesRef);

  const sendCommand = async (ledState: boolean, buzzerState: boolean) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not Signed In',
        description: 'Please log in to update device state.',
      });
      return;
    }

    if (!selectedDevice) {
      toast({
        variant: 'destructive',
        title: 'No Device Selected',
        description: 'Please select a device first.',
      });
      return;
    }

    setLoading(true);

    try {
      const deviceStateRef = doc(firestore, 'devices', selectedDevice);
      updateDocumentNonBlocking(deviceStateRef, {
        led: ledState,
        buzzer: buzzerState,
        updated: serverTimestamp(),
      });
      
      toast({
        title: 'Device Command Sent!',
        description: `Sent command to ${selectedDevice}.`,
      });

    } catch (err: any) {
      console.error('Failed to send command:', err);
      toast({
        variant: 'destructive',
        title: 'Command Failed',
        description: err.message || 'Could not send command to device.',
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
            <CardTitle className="text-2xl">Device Control</CardTitle>
            <CardDescription>
              Manage the state of your device components.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Device</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a device..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="esp32-1">esp32-1</SelectItem>
                  {devices && devices.length > 0 ? (
                    devices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.metadata.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-devices" disabled>
                      No other devices registered
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => sendCommand(true, false)}
                disabled={loading || !user || !selectedDevice}
                size="lg"
                className="text-lg font-semibold"
              >
                 <Lightbulb className="mr-2 h-5 w-5" />
                 LED ON
              </Button>
              <Button
                onClick={() => sendCommand(false, true)}
                disabled={loading || !user || !selectedDevice}
                size="lg"
                className="text-lg font-semibold"
                variant="destructive"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                BUZZ
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Changes will be sent to your device in real-time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
