import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MedicalRecords from '@/components/medical/MedicalRecords';
import { useAuth } from '@/contexts/AuthContext';

const MedicalRecordsPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <MedicalRecords userRole={profile?.role as 'doctor' | 'patient' | 'admin'} />
    </DashboardLayout>
  );
};

export default MedicalRecordsPage;