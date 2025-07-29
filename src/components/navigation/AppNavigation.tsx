import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Users, 
  Building2, 
  Stethoscope, 
  Upload, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  UserPlus,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  roles: string[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Main dashboard',
    roles: ['admin', 'doctor', 'patient']
  },
  {
    name: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    description: 'Manage appointments',
    roles: ['admin', 'doctor', 'patient']
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    description: 'View appointment calendar',
    roles: ['admin', 'doctor', 'patient']
  },
  {
    name: 'Medical Records',
    href: '/medical-records',
    icon: FileText,
    description: 'Patient medical records',
    roles: ['admin', 'doctor', 'patient']
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: Upload,
    description: 'Upload and manage documents',
    roles: ['admin', 'doctor', 'patient']
  },
  {
    name: 'Doctors',
    href: '/doctors',
    icon: Stethoscope,
    description: 'Manage doctors',
    roles: ['admin']
  },
  {
    name: 'Departments',
    href: '/departments',
    icon: Building2,
    description: 'Manage departments',
    roles: ['admin']
  },
  {
    name: 'Find Doctors',
    href: '/find-doctors',
    icon: Search,
    description: 'Search for doctors',
    roles: ['patient']
  }
];

const AppNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out"
      });
    }
  };

  const filteredItems = navigationItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-primary">
          Hospital Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {profile?.first_name} {profile?.last_name}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {profile?.role}
        </p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="space-y-2">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            <span>Profile Settings</span>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <NavigationContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block w-80 h-screen border-r bg-muted/30">
        <NavigationContent />
      </div>
    </>
  );
};

export default AppNavigation;