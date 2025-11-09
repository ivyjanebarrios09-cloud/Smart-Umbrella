import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute left-4 top-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
        >
          <Logo className="h-6 w-6" />
          <span className="font-semibold">UmbraGuard</span>
        </Link>
      </div>
      {children}
    </main>
  );
}
