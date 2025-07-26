import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Stethoscope, Heart, Users, Calendar } from 'lucide-react';
import medicalHero from '@/assets/medical-hero.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <img 
          src={medicalHero} 
          alt="Medical Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-medical-teal/90" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <Stethoscope className="h-16 w-16 mr-4" />
            <h1 className="text-6xl font-bold">MediFlow</h1>
          </div>
          <h2 className="text-3xl font-semibold mb-6">Hospital Management System</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Streamline your healthcare operations with our comprehensive management platform.
            Connect patients, doctors, and administrators in one secure system.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button variant="hero" size="xl">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-primary">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Complete Healthcare Management</h3>
            <p className="text-xl text-muted-foreground">Everything you need to manage your medical practice</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Patient Care</h4>
              <p className="text-muted-foreground">Comprehensive patient management and medical records</p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-medical-teal mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Staff Management</h4>
              <p className="text-muted-foreground">Efficient doctor and staff scheduling systems</p>
            </div>
            <div className="text-center p-6">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Appointment Booking</h4>
              <p className="text-muted-foreground">Streamlined appointment scheduling and management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
