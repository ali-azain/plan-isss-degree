import { ReactNode } from 'react';
import { AppSidebar, MobileBottomNav } from './AppSidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-auto">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
