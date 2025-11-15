'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
