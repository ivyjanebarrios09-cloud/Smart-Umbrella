
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query, Timestamp } from 'firebase/firestore';
import type { NotificationLog } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Bell, History } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NotificationHistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const notificationsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/notification_logs`),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: notifications, isLoading: areNotificationsLoading } =
    useCollection<NotificationLog>(notificationsRef);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'left_behind':
        return <Bell className="h-5 w-5 text-destructive" />;
      case 'weather_alert':
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatTimestamp = (timestamp: Timestamp | string) => {
    if (!timestamp) return 'N/A';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
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
              <History className="h-6 w-6 text-primary" />
              Notification History
            </CardTitle>
            <CardDescription>
              Here are all the alerts and notifications you've received.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {isUserLoading || areNotificationsLoading ? (
                <p className="text-center text-muted-foreground">Loading notifications...</p>
              ) : notifications && notifications.length > 0 ? (
                <ul className="space-y-4">
                  {notifications.map((log) => (
                    <li
                      key={log.id}
                      className="flex items-start gap-4 rounded-lg border p-4"
                    >
                      <div className="mt-1">{getIconForType(log.type)}</div>
                      <div className="flex-1">
                        <p className="font-medium">{log.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <p className="text-muted-foreground">
                    You have no notifications yet.
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
