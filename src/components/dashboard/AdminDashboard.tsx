import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Building2,
  Activity 
} from 'lucide-react';
import { generateDemoStats, generateDemoRecentAppointments, type DemoStats } from '@/data/demoData';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DemoStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial data
    setStats(generateDemoStats());
    setRecentAppointments(generateDemoRecentAppointments());

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      setStats(generateDemoStats());
      setRecentAppointments(generateDemoRecentAppointments());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your hospital operations and monitor system performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+{Math.floor(Math.random() * 20)}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDoctors}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+{Math.floor(Math.random() * 5)}</span> new this month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-warning">+{Math.floor(Math.random() * 15)}%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+{Math.floor(Math.random() * 30)}%</span> from last month
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
              Manage your hospital operations efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link to="/doctors">
                  <UserPlus className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">Manage Doctors</div>
                    <div className="text-xs text-muted-foreground">Add or edit medical staff</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link to="/departments">
                  <Building2 className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">Manage Departments</div>
                    <div className="text-xs text-muted-foreground">Add or edit departments</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link to="/appointments">
                  <FileText className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">View Appointments</div>
                    <div className="text-xs text-muted-foreground">System appointments overview</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="text-sm font-medium">{appointment.patient}</p>
                        <p className="text-xs text-muted-foreground">{appointment.doctor} - {appointment.department}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{appointment.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Status</span>
                  <Badge variant="default" className="bg-success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Services</span>
                  <Badge variant="default" className="bg-success">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Sessions</span>
                  <Badge variant="outline">234 Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;