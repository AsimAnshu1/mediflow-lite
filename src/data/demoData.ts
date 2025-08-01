// Demo data generators for the hospital management system

export interface DemoAppointment {
  time: string;
  patient: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed';
  doctor?: string;
  department?: string;
}

export interface DemoPatientUpdate {
  patient: string;
  update: string;
  time: string;
  type: 'lab' | 'prescription' | 'symptoms' | 'vital';
}

export interface DemoStats {
  totalPatients: number;
  activeDoctors: number;
  appointmentsToday: number;
  revenue: number;
  todayAppointments: number;
  totalPatientsForDoctor: number;
  consultations: number;
  nextAppointment: {
    time: string;
    patient: string;
  };
}

// Patient names pool
const patientNames = [
  'Sarah Johnson', 'Mike Brown', 'Emily Davis', 'Robert Wilson', 'Anna Chen',
  'David Miller', 'Lisa Anderson', 'James Taylor', 'Maria Garcia', 'John Thompson',
  'Jennifer Lee', 'Michael Rodriguez', 'Jessica Wang', 'Daniel Kim', 'Ashley Martinez'
];

// Doctor names pool
const doctorNames = [
  'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis',
  'Dr. Miller', 'Dr. Wilson', 'Dr. Moore', 'Dr. Taylor', 'Dr. Anderson'
];

// Departments
const departments = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Internal Medicine',
  'Emergency', 'Radiology', 'Surgery', 'Dermatology', 'Oncology'
];

// Appointment types
const appointmentTypes = [
  'Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Surgery',
  'Therapy', 'Screening', 'Vaccination', 'Lab Work', 'Imaging'
];

// Update types and descriptions
const updateTypes = {
  lab: ['Lab results updated', 'Blood work completed', 'Test results available', 'X-ray results ready'],
  prescription: ['Prescription renewed', 'Medication adjusted', 'New prescription added', 'Dosage modified'],
  symptoms: ['New symptoms recorded', 'Symptoms improved', 'Side effects noted', 'Recovery progress'],
  vital: ['Vitals updated', 'Blood pressure checked', 'Weight recorded', 'Temperature monitored']
};

// Time options
const appointmentTimes = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
];

const timeAgo = ['2 hours ago', '4 hours ago', '6 hours ago', '1 day ago', '2 days ago', '3 days ago'];

// Utility functions
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// Demo data generators
export const generateDemoStats = (): DemoStats => ({
  totalPatients: getRandomNumber(2000, 3000),
  activeDoctors: getRandomNumber(80, 120),
  appointmentsToday: getRandomNumber(120, 200),
  revenue: getRandomNumber(10000, 20000),
  todayAppointments: getRandomNumber(8, 15),
  totalPatientsForDoctor: getRandomNumber(100, 200),
  consultations: getRandomNumber(70, 120),
  nextAppointment: {
    time: getRandomItem(appointmentTimes),
    patient: getRandomItem(patientNames)
  }
});

export const generateDemoAppointments = (count: number = 4, userRole: 'patient' | 'doctor' | 'admin' = 'patient'): DemoAppointment[] => {
  return Array.from({ length: count }, () => ({
    time: getRandomItem(appointmentTimes),
    patient: getRandomItem(patientNames),
    type: getRandomItem(appointmentTypes),
    status: getRandomItem(['confirmed', 'pending', 'completed'] as const),
    doctor: userRole !== 'doctor' ? getRandomItem(doctorNames) : undefined,
    department: getRandomItem(departments)
  }));
};

export const generateDemoPatientUpdates = (count: number = 3): DemoPatientUpdate[] => {
  return Array.from({ length: count }, () => {
    const type = getRandomItem(Object.keys(updateTypes)) as keyof typeof updateTypes;
    return {
      patient: getRandomItem(patientNames),
      update: getRandomItem(updateTypes[type]),
      time: getRandomItem(timeAgo),
      type
    };
  });
};

export const generateDemoRecentAppointments = (count: number = 3): Array<{patient: string, doctor: string, department: string, time: string}> => {
  return Array.from({ length: count }, () => ({
    patient: getRandomItem(patientNames),
    doctor: getRandomItem(doctorNames),
    department: getRandomItem(departments),
    time: `Today ${getRandomItem(['9:30 AM', '11:00 AM', '2:30 PM', '4:00 PM'])}`
  }));
};

// Refresh data periodically (simulates real-time updates)
export const useDemoData = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return refreshKey;
};

// React import for the hook
import React from 'react';