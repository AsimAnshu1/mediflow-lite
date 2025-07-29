import React from 'react';
import AppNavigation from '@/components/navigation/AppNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppNavigation />
      <main className="flex-1 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;