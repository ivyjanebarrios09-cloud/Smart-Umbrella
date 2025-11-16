'use client';

<<<<<<< HEAD
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';
=======
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { NotificationLog } from '@/lib/types';
>>>>>>> origin/main
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
<<<<<<< HEAD
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase';
import { collection } from 'firebase/firestore';
import { NotificationLog } from '@/lib/types';
import { format } from 'date-fns';

export default function NotificationHistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/notification_logs`);
  }, [user, firestore]);

  const {
    data: notifications,
    isLoading,
    error,
  } = useCollection<NotificationLog>(notificationsQuery);

  useEffect(() => {
    if (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [error]);
=======
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
>>>>>>> origin/main

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
<<<<<<< HEAD
              <Bell className="h-6 w-6" />
              <span>Notification History</span>
            </CardTitle>
            <CardDescription>
              Here are all the alerts you've received.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-center">Loading notifications...</p>}
            {error && (
              <p className="text-center text-destructive">
                Could not load notifications.
              </p>
            )}
            {!isLoading && !error && notifications?.length === 0 && (
              <p className="text-center text-muted-foreground">
                You have no notifications yet.
              </p>
            )}
            {notifications && notifications.length > 0 && (
              <ul className="space-y-4">
                {notifications
                  .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
                  .map((log) => (
                    <li
                      key={log.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-semibold">{log.message}</p>
                        <p className="text-sm text-muted-foreground">
                          Type: {log.type}
                        </p>
                      </div>
                      <span className="text-right text-sm text-muted-foreground">
                        {format(
                          log.timestamp.toDate(),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
=======
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
                <p>Loading notifications...</p>
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
                          {formatDistanceToNow(new Date(log.timestamp), {
                            addSuffix: true,
                          })}
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
>>>>>>> origin/main
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
