'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Compass, User, ShoppingCart } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">Munger's Compass</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1">
          <Button variant="ghost" asChild className={cn(pathname === '/' && 'bg-secondary')}>
            <Link href="/" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Purchase Advisor
            </Link>
          </Button>
          <Button variant="ghost" asChild className={cn(pathname === '/profile' && 'bg-secondary')}>
            <Link href="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Financial Profile
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
