-- Create storage bucket for medical documents
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-documents', 'medical-documents', false);

-- Create policies for medical documents storage
CREATE POLICY "Authenticated users can view their own medical documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can upload their own medical documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own medical documents"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own medical documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create medical_documents table to track uploaded files
CREATE TABLE public.medical_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  description TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medical_documents
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for medical_documents table
CREATE POLICY "Patients can view their own documents"
ON public.medical_documents
FOR SELECT
USING (patient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can view their patients' documents"
ON public.medical_documents
FOR SELECT
USING (
  patient_id IN (
    SELECT DISTINCT a.patient_id 
    FROM appointments a 
    WHERE a.doctor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Authenticated users can upload documents"
ON public.medical_documents
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update documents they uploaded"
ON public.medical_documents
FOR UPDATE
USING (uploaded_by = auth.uid());

CREATE POLICY "Admins can manage all documents"
ON public.medical_documents
FOR ALL
USING (get_user_role(auth.uid()) = 'admin');

-- Add trigger for updated_at
CREATE TRIGGER update_medical_documents_updated_at
BEFORE UPDATE ON public.medical_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();