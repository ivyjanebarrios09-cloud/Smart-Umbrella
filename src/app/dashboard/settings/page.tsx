
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, Laptop, Moon, Sun, KeyRound } from "lucide-react";
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
import type { Umbrella } from '@/lib/types';
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [leftBehindAlert, setLeftBehindAlert] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const umbrellasRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/umbrellas`);
  }, [firestore, user]);

  const { data: umbrellas, isLoading: areUmbrellasLoading } = useCollection<Umbrella>(umbrellasRef);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-6 w-6 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your user and device identifiers for configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <div className="flex gap-2">
                  <Input id="userId" value={user?.uid ?? 'Loading...'} readOnly />
                  <Button variant="outline" onClick={() => copyToClipboard(user?.uid ?? '')}>Copy</Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Umbrella IDs</Label>
                {isUserLoading || areUmbrellasLoading ? (
                   <p className="text-sm text-muted-foreground">Loading umbrellas...</p>
                ) : umbrellas && umbrellas.length > 0 ? (
                  <div className="space-y-4">
                    {umbrellas.map(umbrella => (
                      <div key={umbrella.id} className="space-y-2">
                        <p className="text-sm font-medium">{umbrella.name}</p>
                         <div className="flex gap-2">
                            <Input id={`umbrellaId-${umbrella.id}`} value={umbrella.id} readOnly />
                            <Button variant="outline" onClick={() => copyToClipboard(umbrella.id)}>Copy</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No umbrellas registered for this user.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
