import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, Clock, User, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, isSameDay } from 'date-fns';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  reason_for_visit: string;
  status: string;
  patient_profile?: {
    first_name: string;
    last_name: string;
  };
  doctor_profile?: {
    first_name: string;
    last_name: string;
  };
  departments?: {
    name: string;
  };
}

interface AppointmentCalendarProps {
  userRole?: 'doctor' | 'patient' | 'admin';
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ userRole = 'patient' }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, [profile, userRole]);

  useEffect(() => {
    // Filter appointments for selected date
    const dayAppointments = appointments.filter(apt => 
      isSameDay(new Date(apt.appointment_date), selectedDate)
    );
    setSelectedDayAppointments(dayAppointments);
  }, [selectedDate, appointments]);

  const fetchAppointments = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patient_profile:profiles!appointments_patient_id_fkey(first_name, last_name),
          doctor_profile:profiles!appointments_doctor_id_fkey(first_name, last_name),
          departments(name)
        `);

      if (userRole === 'patient') {
        query = query.eq('patient_id', profile.id);
      } else if (userRole === 'doctor') {
        query = query.eq('doctor_id', profile.id);
      }

      const { data, error } = await query.order('appointment_date').order('appointment_time');

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch appointments"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentDates = () => {
    return appointments.map(apt => new Date(apt.appointment_date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-destructive';
      case 'completed':
        return 'bg-medical-blue';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Appointment Calendar
          </CardTitle>
          <CardDescription>
            {userRole === 'doctor' 
              ? 'View your patient appointments and schedule' 
              : 'View your upcoming appointments and schedule new ones'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar */}
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  hasAppointments: getAppointmentDates()
                }}
                modifiersStyles={{
                  hasAppointments: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: 'bold'
                  }
                }}
              />
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Blue dates have appointments</p>
                <p>• Click on a date to view details</p>
              </div>
            </div>

            {/* Selected Day Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                <Badge variant="outline">
                  {selectedDayAppointments.length} appointment{selectedDayAppointments.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : selectedDayAppointments.length === 0 ? (
                <Card className="p-6 text-center">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No appointments scheduled</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {selectedDayAppointments.map((appointment) => (
                    <Card key={appointment.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {format(new Date(`2000-01-01 ${appointment.appointment_time}`), 'h:mm a')}
                            </span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(appointment.status)} text-white`}
                          >
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {userRole === 'doctor' && appointment.patient_profile && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {appointment.patient_profile.first_name} {appointment.patient_profile.last_name}
                              </span>
                            </div>
                          )}

                          {userRole === 'patient' && appointment.doctor_profile && (
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Dr. {appointment.doctor_profile.first_name} {appointment.doctor_profile.last_name}
                              </span>
                            </div>
                          )}

                          {appointment.departments && (
                            <div className="text-sm text-muted-foreground">
                              {appointment.departments.name}
                            </div>
                          )}

                          <div className="text-sm">
                            <span className="font-medium">Reason: </span>
                            {appointment.reason_for_visit}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Appointment Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Date:</span>
                                    <p>{format(new Date(appointment.appointment_date), 'PPP')}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Time:</span>
                                    <p>{format(new Date(`2000-01-01 ${appointment.appointment_time}`), 'h:mm a')}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>
                                    <Badge className={`${getStatusColor(appointment.status)} text-white ml-2`}>
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <span className="font-medium">Department:</span>
                                    <p>{appointment.departments?.name}</p>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Reason for Visit:</span>
                                  <p className="mt-1">{appointment.reason_for_visit}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;