'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';
import { Menu, Moon, Sun } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">BlogApp</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/blog" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Blog
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
