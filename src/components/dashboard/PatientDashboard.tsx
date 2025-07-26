import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Heart, 
  FileText, 
  User, 
  Activity,
  CalendarPlus,
  Search
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your health appointments and view your medical information.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Next: Tomorrow 2:30 PM
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Last updated yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+5%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                1 expires next week
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
              Manage your healthcare journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <CalendarPlus className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Book Appointment</div>
                  <div className="text-xs text-muted-foreground">Schedule with a doctor</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Search className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Find Doctors</div>
                  <div className="text-xs text-muted-foreground">Browse by department</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <FileText className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Medical History</div>
                  <div className="text-xs text-muted-foreground">View your records</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments & Health Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    date: "Tomorrow", 
                    time: "2:30 PM", 
                    doctor: "Dr. Sarah Smith", 
                    department: "Cardiology",
                    type: "Check-up"
                  },
                  { 
                    date: "Dec 28", 
                    time: "10:00 AM", 
                    doctor: "Dr. Mike Johnson", 
                    department: "General Medicine",
                    type: "Follow-up"
                  },
                  { 
                    date: "Jan 5", 
                    time: "3:45 PM", 
                    doctor: "Dr. Emily Brown", 
                    department: "Dermatology",
                    type: "Consultation"
                  }
                ].map((appointment, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{appointment.date} at {appointment.time}</span>
                      </div>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{appointment.doctor}</p>
                      <p className="text-muted-foreground">{appointment.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
              <CardDescription>Your latest health information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Blood Pressure</p>
                      <p className="text-xs text-muted-foreground">Last checked: 2 days ago</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">120/80</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Heart Rate</p>
                      <p className="text-xs text-muted-foreground">Resting rate</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">72 bpm</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Last Lab Results</p>
                      <p className="text-xs text-muted-foreground">All within normal range</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-success">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;