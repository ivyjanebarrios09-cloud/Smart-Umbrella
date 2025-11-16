
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/icons/logo';
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
            <Logo className="h-12 w-12 text-primary" />
            <h1 className="text-xl font-bold">Smart Umbrella Tracker</h1>
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
        <section className="relative h-[60vh] min-h-[500px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Never lose your umbrella again.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-200">
                Our Smart Umbrella connects to your phone. Get left-behind
                alerts, real-time weather notifications, and find your umbrella
                right from the app.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Smart Umbrella Tracker. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
