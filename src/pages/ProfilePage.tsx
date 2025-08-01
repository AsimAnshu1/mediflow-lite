import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile"
      });
    }
  };

  const handleCancel = () => {
    setEditedProfile({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      emergency_contact_name: profile?.emergency_contact_name || '',
      emergency_contact_phone: profile?.emergency_contact_phone || '',
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'doctor':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const getInitials = () => {
    const first = profile?.first_name?.[0] || '';
    const last = profile?.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and account settings.
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-xl font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <Badge className={`mt-2 text-white ${getRoleColor(profile?.role || 'patient')}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Member since recently
                  </span>
                </div>
                
                {profile?.date_of_birth && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Born {new Date(profile.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={editedProfile.first_name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.first_name || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={editedProfile.last_name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.last_name || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.gender || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your full address"
                  />
                ) : (
                  <div className="flex items-start gap-2 p-3 border rounded-md bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{profile?.address || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                Contact information for emergencies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                  {isEditing ? (
                    <Input
                      id="emergency_name"
                      value={editedProfile.emergency_contact_name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.emergency_contact_name || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                  {isEditing ? (
                    <Input
                      id="emergency_phone"
                      type="tel"
                      value={editedProfile.emergency_contact_phone}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.emergency_contact_phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;