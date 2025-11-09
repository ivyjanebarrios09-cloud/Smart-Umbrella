import Link from "next/link";
import { Logo } from "@/components/icons/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
       <div className="absolute top-4 left-4">
         <Link href="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">
            <Logo className="h-6 w-6" />
            <span className="font-semibold">UmbraGuard</span>
          </Link>
       </div>
      {children}
    </main>
  );
}
