import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DoctorManagement from '@/components/admin/DoctorManagement';

const DoctorsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Management</h1>
          <p className="text-muted-foreground">
            Manage doctors, their profiles, and assignments.
          </p>
        </div>
        
        <DoctorManagement />
      </div>
    </DashboardLayout>
  );
};

export default DoctorsPage;