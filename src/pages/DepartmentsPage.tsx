import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DepartmentManagement from '@/components/admin/DepartmentManagement';

const DepartmentsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
          <p className="text-muted-foreground">
            Manage hospital departments and their information.
          </p>
        </div>
        
        <DepartmentManagement />
      </div>
    </DashboardLayout>
  );
};

export default DepartmentsPage;