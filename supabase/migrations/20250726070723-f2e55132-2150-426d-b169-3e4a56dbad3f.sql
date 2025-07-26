-- Fix security warnings by restricting policies to authenticated users only
-- and fixing function search paths

-- Drop existing policies and recreate with authenticated restrictions
DROP POLICY IF EXISTS "Everyone can view departments" ON public.departments;
DROP POLICY IF EXISTS "Everyone can view doctor profiles" ON public.doctor_profiles;

-- Fix function search paths
DROP FUNCTION IF EXISTS public.get_user_role(UUID);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with proper search path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Recreate handle_new_user function with proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
  );
  RETURN NEW;
END;
$$;

-- Recreate policies with authenticated user restrictions
CREATE POLICY "Authenticated users can view departments"
ON public.departments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view doctor profiles"
ON public.doctor_profiles FOR SELECT
TO authenticated
USING (true);

-- Update existing policies to specify authenticated role where missing
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can create profiles"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Update department policies
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
CREATE POLICY "Admins can manage departments"
ON public.departments FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Update doctor_profiles policies
DROP POLICY IF EXISTS "Doctors can update their own profile" ON public.doctor_profiles;
DROP POLICY IF EXISTS "Admins can manage doctor profiles" ON public.doctor_profiles;

CREATE POLICY "Doctors can update their own profile"
ON public.doctor_profiles FOR UPDATE
TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage doctor profiles"
ON public.doctor_profiles FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Update appointment policies
DROP POLICY IF EXISTS "Patients can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;

CREATE POLICY "Patients can view their own appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can view their appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (doctor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients can create their own appointments"
ON public.appointments FOR INSERT
TO authenticated
WITH CHECK (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients can update their own appointments"
ON public.appointments FOR UPDATE
TO authenticated
USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can update their appointments"
ON public.appointments FOR UPDATE
TO authenticated
USING (doctor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all appointments"
ON public.appointments FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Update medical records policies
DROP POLICY IF EXISTS "Patients can view their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Doctors can view their patient records" ON public.medical_records;
DROP POLICY IF EXISTS "Doctors can create medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Doctors can update their medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Admins can manage all medical records" ON public.medical_records;

CREATE POLICY "Patients can view their own medical records"
ON public.medical_records FOR SELECT
TO authenticated
USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can view their patient records"
ON public.medical_records FOR SELECT
TO authenticated
USING (doctor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can create medical records"
ON public.medical_records FOR INSERT
TO authenticated
WITH CHECK (doctor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can update their medical records"
ON public.medical_records FOR UPDATE
TO authenticated
USING (doctor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all medical records"
ON public.medical_records FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');