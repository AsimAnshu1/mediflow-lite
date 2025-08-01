import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { generateDemoAppointments, type DemoAppointment } from '@/data/demoData';

const PatientDashboard: React.FC = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<DemoAppointment[]>([]);
  const [stats, setStats] = useState({
    upcomingCount: 0,
    medicalRecords: 0,
    healthScore: 0,
    prescriptions: 0,
    nextAppointment: ''
  });

  useEffect(() => {
    // Generate initial data
    const appointments = generateDemoAppointments(3, 'patient');
    setUpcomingAppointments(appointments);
    
    const newStats = {
      upcomingCount: appointments.length,
      medicalRecords: Math.floor(Math.random() * 20) + 5,
      healthScore: Math.floor(Math.random() * 15) + 75,
      prescriptions: Math.floor(Math.random() * 4) + 1,
      nextAppointment: appointments[0]?.time || 'No appointments'
    };
    setStats(newStats);

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      const newAppointments = generateDemoAppointments(3, 'patient');
      setUpcomingAppointments(newAppointments);
      setStats({
        upcomingCount: newAppointments.length,
        medicalRecords: Math.floor(Math.random() * 20) + 5,
        healthScore: Math.floor(Math.random() * 15) + 75,
        prescriptions: Math.floor(Math.random() * 4) + 1,
        nextAppointment: newAppointments[0]?.time || 'No appointments'
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
              <div className="text-2xl font-bold">{stats.upcomingCount}</div>
              <p className="text-xs text-muted-foreground">
                Next: {stats.nextAppointment}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.medicalRecords}</div>
              <p className="text-xs text-muted-foreground">
                Last updated {Math.floor(Math.random() * 7) + 1} days ago
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.healthScore}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+{Math.floor(Math.random() * 10)}%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.prescriptions}</div>
              <p className="text-xs text-muted-foreground">
                {Math.floor(Math.random() * 2) ? 'All current' : '1 expires next week'}
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
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link to="/appointments">
                  <CalendarPlus className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">Book Appointment</div>
                    <div className="text-xs text-muted-foreground">Schedule with a doctor</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link to="/find-doctors">
                  <Search className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">Find Doctors</div>
                    <div className="text-xs text-muted-foreground">Browse by department</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link to="/medical-records">
                  <FileText className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">Medical History</div>
                    <div className="text-xs text-muted-foreground">View your records</div>
                  </div>
                </Link>
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
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{appointment.time}</span>
                      </div>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{appointment.doctor || 'Dr. TBD'}</p>
                      <p className="text-muted-foreground">{appointment.department || 'General Medicine'}</p>
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
                      <p className="text-xs text-muted-foreground">Last checked: {Math.floor(Math.random() * 5) + 1} days ago</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 110}/{Math.floor(Math.random() * 15) + 70}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Heart Rate</p>
                      <p className="text-xs text-muted-foreground">Resting rate</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 65} bpm</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Last Lab Results</p>
                      <p className="text-xs text-muted-foreground">{Math.random() > 0.8 ? 'Some abnormal values' : 'All within normal range'}</p>
                    </div>
                  </div>
                  <Badge variant="default" className={Math.random() > 0.8 ? 'bg-warning' : 'bg-success'}>
                    {Math.random() > 0.8 ? 'Review' : 'Normal'}
                  </Badge>
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