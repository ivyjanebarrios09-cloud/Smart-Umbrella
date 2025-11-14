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
import type { Umbrella } from '@/lib/types';

const alertFormSchema = z.object({
  umbrellaId: z.string().min(1, 'Please select an umbrella.'),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

export default function UmbrellaAlertPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const umbrellasRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/umbrellas`);
  }, [firestore, user]);

  const { data: umbrellas, isLoading: areUmbrellasLoading } =
    useCollection<Umbrella>(umbrellasRef);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      umbrellaId: '',
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
          umbrellaId: data.umbrellaId,
          message: 'I think I left my umbrella behind!',
          type: 'left_behind',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send alert.');
      }

      toast({
        title: 'Alert Sent!',
        description: 'Your "left-behind" notification has been logged.',
      });
      form.reset();
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem sending your alert.',
      });
    }
  }

  if (isUserLoading || areUmbrellasLoading) {
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
            <CardTitle>Umbrella Alert</CardTitle>
            <CardDescription>
              Select an umbrella to report it as missing. This will log a "left-behind" alert in your notification history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="umbrellaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Umbrella</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the missing umbrella" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {umbrellas && umbrellas.length > 0 ? (
                            umbrellas.map((umbrella) => (
                              <SelectItem key={umbrella.id} value={umbrella.id}>
                                {umbrella.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No umbrellas found. Add one in settings.
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={!umbrellas || umbrellas.length === 0}>
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
