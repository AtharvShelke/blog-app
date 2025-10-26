'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Eye,
  PanelLeftClose,
  PanelLeftOpen 
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

const sidebarItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Posts',
    href: '/dashboard/posts',
    icon: FileText,
  },
  {
    title: 'Categories',
    href: '/dashboard/categories',
    icon: FolderOpen,
  },
  {
    title: 'View Blog',
    href: '/blog',
    icon: Eye,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">Dashboard</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
                    isActive
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">
              BlogApp Dashboard v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Toggle button for desktop */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 z-40 hidden lg:flex"
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}
