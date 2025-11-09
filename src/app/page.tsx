import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/icons/logo';
import { AIWeatherChart } from '@/components/charts/ai-weather-chart';
import { CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'umbra-guard-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">UmbraGuard</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Never lose your umbrella again.
              </h2>
              <p className="text-lg text-muted-foreground">
                UmbraGuard connects your smart umbrella to your phone. Get left-behind alerts, real-time weather notifications, and control your umbrella's LED light right from the app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">View Demo</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>
        </section>

        <section className="bg-background/50 py-16 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-accent text-accent-foreground rounded-full px-4 py-1 text-sm font-semibold">
                  AI Weather Engine
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Hyper-local predictions you can trust.
                </h3>
                <p className="text-lg text-muted-foreground">
                  Our AI model goes beyond standard forecasts. By combining data from WeatherAPI with your device's precise location, UmbraGuard delivers superior, hour-by-hour predictions.
                </p>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <span className="font-semibold text-foreground">Early Alert System:</span> Get notified of incoming rain minutes before it starts, giving you a crucial head start.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <span className="font-semibold text-foreground">Continuous Learning:</span> Our AI constantly analyzes patterns to improve accuracy over time, learning the unique microclimates in your area.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-card rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold text-center mb-4">AI vs. Normal Weather Alerts</h4>
                <AIWeatherChart />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} UmbraGuard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
