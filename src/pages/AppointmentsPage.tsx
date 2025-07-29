import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentBooking from '@/components/appointments/AppointmentBooking';
import AppointmentList from '@/components/appointments/AppointmentList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const AppointmentsPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your appointments and schedule new ones.
          </p>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">My Appointments</TabsTrigger>
            {(profile?.role === 'patient' || profile?.role === 'admin') && (
              <TabsTrigger value="book">Book New</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="list">
            <AppointmentList userRole={profile?.role as 'doctor' | 'patient' | 'admin'} />
          </TabsContent>
          
          {(profile?.role === 'patient' || profile?.role === 'admin') && (
            <TabsContent value="book">
              <AppointmentBooking />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;