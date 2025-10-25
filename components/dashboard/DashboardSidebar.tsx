'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Settings,
  Home,
  Eye
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">BlogApp</span>
        </Link>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t">
        <p className="text-xs text-muted-foreground px-3">
          Dashboard v1.0
        </p>
      </div>
    </aside>
  );
}
