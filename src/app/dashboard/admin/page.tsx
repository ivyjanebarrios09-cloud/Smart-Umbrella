'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Database, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
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
              <Database className="h-6 w-6 text-primary" />
              Admin Section
            </CardTitle>
            <CardDescription>
              This section is for administrative tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The weather data is now updated automatically by the device via
                the `/api/weather` endpoint. No manual action is needed here
                anymore.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
