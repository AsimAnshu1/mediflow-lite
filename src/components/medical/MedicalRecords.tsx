import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileText, Plus, Search, User, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const medicalRecordSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  appointment_id: z.string().optional(),
  diagnosis: z.string().min(5, 'Diagnosis is required'),
  treatment: z.string().min(5, 'Treatment is required'),
  medications: z.string().optional(),
  notes: z.string().optional(),
  vitals: z.object({
    blood_pressure: z.string().optional(),
    heart_rate: z.string().optional(),
    temperature: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
  }).optional(),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

interface MedicalRecord {
  id: string;
  diagnosis: string;
  treatment: string;
  medications?: string;
  notes?: string;
  vitals?: any;
  created_at: string;
  patient_profile: {
    first_name: string;
    last_name: string;
  };
  doctor_profile: {
    first_name: string;
    last_name: string;
  };
  appointments?: {
    appointment_date: string;
    reason_for_visit: string;
  };
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
}

interface MedicalRecordsProps {
  userRole?: 'doctor' | 'patient' | 'admin';
}

const MedicalRecords: React.FC<MedicalRecordsProps> = ({ userRole = 'patient' }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
  });

  useEffect(() => {
    fetchMedicalRecords();
    if (userRole === 'doctor' || userRole === 'admin') {
      fetchPatients();
    }
  }, [profile, userRole]);

  const fetchMedicalRecords = async () => {
    if (!profile) return;

    try {
      let query = supabase
        .from('medical_records')
        .select(`
          *,
          patient_profile:profiles!medical_records_patient_id_fkey(first_name, last_name),
          doctor_profile:profiles!medical_records_doctor_id_fkey(first_name, last_name),
          appointments(appointment_date, reason_for_visit)
        `);

      if (userRole === 'patient') {
        query = query.eq('patient_id', profile.id);
      } else if (userRole === 'doctor') {
        query = query.eq('doctor_id', profile.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data as any || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch medical records"
      });
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, date_of_birth')
        .eq('role', 'patient')
        .order('first_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch patients"
      });
    }
  };

  const onSubmit = async (data: MedicalRecordFormData) => {
    if (!profile || userRole !== 'doctor') return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('medical_records')
        .insert({
          ...data,
          doctor_id: profile.id,
          vitals: data.vitals ? JSON.stringify(data.vitals) : null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medical record created successfully"
      });

      setIsDialogOpen(false);
      form.reset();
      fetchMedicalRecords();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create medical record"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record =>
    `${record.patient_profile.first_name} ${record.patient_profile.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {userRole === 'doctor' ? 'Patient Medical Records' : 'My Medical Records'}
        </h2>
        
        {userRole === 'doctor' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Medical Record</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patient_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full p-2 border rounded">
                            <option value="">Select patient</option>
                            {patients.map((patient) => (
                              <option key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="diagnosis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnosis</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="treatment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Treatment</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medications</FormLabel>
                        <FormControl>
                          <Textarea placeholder="List medications and dosages..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Vital Signs</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="vitals.blood_pressure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Pressure</FormLabel>
                            <FormControl>
                              <Input placeholder="120/80" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="vitals.heart_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heart Rate (bpm)</FormLabel>
                            <FormControl>
                              <Input placeholder="70" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="vitals.temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature (°F)</FormLabel>
                            <FormControl>
                              <Input placeholder="98.6" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vitals.weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (lbs)</FormLabel>
                            <FormControl>
                              <Input placeholder="150" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="vitals.height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (ft/in)</FormLabel>
                            <FormControl>
                              <Input placeholder="5'8\"" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Record'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No medical records found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {record.patient_profile.first_name} {record.patient_profile.last_name}
                        </span>
                        <Badge variant="outline">
                          Dr. {record.doctor_profile.first_name} {record.doctor_profile.last_name}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(record.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {record.vitals && (
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Vitals recorded</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Diagnosis</h4>
                      <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Treatment</h4>
                      <p className="text-sm text-muted-foreground">{record.treatment}</p>
                    </div>
                  </div>

                  {record.medications && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Medications</h4>
                      <p className="text-sm text-muted-foreground">{record.medications}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">{record.notes}</p>
                    </div>
                  )}

                  {record.vitals && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Vital Signs</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        {record.vitals.blood_pressure && (
                          <div>
                            <span className="text-muted-foreground">BP:</span>
                            <span className="ml-1">{record.vitals.blood_pressure}</span>
                          </div>
                        )}
                        {record.vitals.heart_rate && (
                          <div>
                            <span className="text-muted-foreground">HR:</span>
                            <span className="ml-1">{record.vitals.heart_rate} bpm</span>
                          </div>
                        )}
                        {record.vitals.temperature && (
                          <div>
                            <span className="text-muted-foreground">Temp:</span>
                            <span className="ml-1">{record.vitals.temperature}°F</span>
                          </div>
                        )}
                        {record.vitals.weight && (
                          <div>
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="ml-1">{record.vitals.weight} lbs</span>
                          </div>
                        )}
                        {record.vitals.height && (
                          <div>
                            <span className="text-muted-foreground">Height:</span>
                            <span className="ml-1">{record.vitals.height}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;