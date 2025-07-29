import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentCalendar from '@/components/calendar/AppointmentCalendar';
import { useAuth } from '@/contexts/AuthContext';

const CalendarPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View your appointments in calendar format.
          </p>
        </div>
        
        <AppointmentCalendar userRole={profile?.role as 'doctor' | 'patient' | 'admin'} />
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;