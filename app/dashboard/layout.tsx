import DashboardSidebar from './DashboardSidebar';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden group/design-root">
        <Navbar />
        <div className="flex grow">
          <DashboardSidebar />        
          <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 bg-linear-to-b from-[#FDF9E9]">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}