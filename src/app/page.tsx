'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/icons/logo';
import { AIWeatherChart } from '@/components/charts/ai-weather-chart';
import { CheckCircle } from 'lucide-react';
import { useUser } from '@/firebase';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(
    (img) => img.id === 'umbra-guard-hero'
  );
  const { user, isUserLoading } = useUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">UmbraGuard</h1>
          </div>
          <nav className="flex items-center gap-4">
            {isUserLoading ? (
              <div />
            ) : user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Never lose your umbrella again.
              </h2>
              <p className="text-lg text-muted-foreground">
                UmbraGuard connects your smart umbrella to your phone. Get
                left-behind alerts, real-time weather notifications, and
                control your umbrella's LED light right from the app.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">View Demo</Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                />
              )}
            </div>
          </div>
        </section>

        <section className="bg-background/50 py-16 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
                  AI Weather Engine
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Hyper-local predictions you can trust.
                </h3>
                <p className="text-lg text-muted-foreground">
                  Our AI model goes beyond standard forecasts. By combining data
                  from WeatherAPI with your device's precise location,
                  UmbraGuard delivers superior, hour-by-hour predictions.
                </p>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold text-foreground">
                        Early Alert System:
                      </span>{' '}
                      Get notified of incoming rain minutes before it starts,
                      giving you a crucial head start.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold text-foreground">
                        Continuous Learning:
                      </span>{' '}
                      Our AI constantly analyzes patterns to improve accuracy
                      over time, learning the unique microclimates in your area.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-lg">
                <h4 className="mb-4 text-center text-lg font-semibold">
                  AI vs. Normal Weather Alerts
                </h4>
                <AIWeatherChart />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} UmbraGuard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
