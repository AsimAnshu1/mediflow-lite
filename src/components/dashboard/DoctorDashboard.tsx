import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Stethoscope, 
  Activity,
  User
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            View your schedule and manage patient care efficiently.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                3 pending, 9 scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+8</span> new this week
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2:30</div>
              <p className="text-xs text-muted-foreground">
                PM - Sarah Johnson
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your practice efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Calendar className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">View Schedule</div>
                  <div className="text-xs text-muted-foreground">Check today's appointments</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <FileText className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Patient Records</div>
                  <div className="text-xs text-muted-foreground">Access medical histories</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <User className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Update Profile</div>
                  <div className="text-xs text-muted-foreground">Manage your information</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "9:00 AM", patient: "Sarah Johnson", type: "Check-up", status: "confirmed" },
                  { time: "10:30 AM", patient: "Mike Brown", type: "Follow-up", status: "confirmed" },
                  { time: "2:30 PM", patient: "Emily Davis", type: "Consultation", status: "pending" },
                  { time: "4:00 PM", patient: "Robert Wilson", type: "Check-up", status: "confirmed" }
                ].map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-primary">{appointment.time}</div>
                      <div>
                        <p className="text-sm font-medium">{appointment.patient}</p>
                        <p className="text-xs text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Patient Updates</CardTitle>
              <CardDescription>Latest medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { patient: "Sarah Johnson", update: "Lab results updated", time: "2 hours ago" },
                  { patient: "Mike Brown", update: "Prescription renewed", time: "4 hours ago" },
                  { patient: "Emily Davis", update: "New symptoms recorded", time: "1 day ago" }
                ].map((update, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-medical-teal"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{update.patient}</p>
                      <p className="text-xs text-muted-foreground">{update.update}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{update.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;