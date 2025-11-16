'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { collection } from 'firebase/firestore';
import type { Device } from '@/lib/types';

const alertFormSchema = z.object({
  deviceId: z.string().min(1, 'Please select a device.'),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

export default function DeviceAlertPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const devicesRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/devices`);
  }, [firestore, user]);

  const { data: devices, isLoading: areDevicesLoading } =
    useCollection<Device>(devicesRef);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      deviceId: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: AlertFormValues) {
    if (!user) return;

    try {
      const response = await fetch('/api/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          deviceId: data.deviceId,
          message: 'I think I left my device behind!',
          type: 'left_behind',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to send alert.');
      }

      toast({
        title: 'Alert Sent!',
        description: 'Your "left-behind" notification has been logged.',
      });
      form.reset();
    } catch (error: any) {
      console.error('Error sending alert:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem sending your alert.',
      });
    }
  }

  if (isUserLoading || areDevicesLoading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">Loading...</div>
      </div>
    );
  }

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
            <CardTitle>Device Alert</CardTitle>
            <CardDescription>
              Select a device to report it as missing. This will log a "left-behind" alert in your notification history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Device</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the missing device" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {devices && devices.length > 0 ? (
                            devices.map((device) => (
                              <SelectItem key={device.id} value={device.id}>
                                {device.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No devices found. Add one in settings.
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={!devices || devices.length === 0}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Missing Alert
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
