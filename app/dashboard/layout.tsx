import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
