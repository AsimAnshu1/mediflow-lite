import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploadProps {
  patientId?: string;
  onUploadComplete?: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  description: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ patientId, onUploadComplete }) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [description, setDescription] = useState('');
  const { profile } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      description: description || `${file.name} - ${new Date().toLocaleDateString()}`
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    // Upload each file
    newFiles.forEach((uploadingFile, index) => {
      uploadFileAsync(uploadingFile, index + uploadingFiles.length);
    });
  }, [description, uploadingFiles.length]);

  const uploadFileAsync = async (uploadingFile: UploadingFile, fileIndex: number) => {
    if (!profile) return;

    const targetPatientId = patientId || profile.id;
    const fileName = `${Date.now()}-${uploadingFile.file.name}`;
    const filePath = `${profile.user_id}/${fileName}`;

    try {
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(filePath, uploadingFile.file);

      if (uploadError) throw uploadError;

      // Simulate progress for better UX
      setUploadingFiles(prev => 
        prev.map((file, idx) => 
          idx === fileIndex 
            ? { ...file, progress: 100 }
            : file
        )
      );

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('medical_documents')
        .insert({
          patient_id: targetPatientId,
          file_name: uploadingFile.file.name,
          file_path: filePath,
          file_size: uploadingFile.file.size,
          file_type: uploadingFile.file.type,
          description: uploadingFile.description,
          uploaded_by: profile.user_id
        });

      if (dbError) throw dbError;

      // Update status to complete
      setUploadingFiles(prev => 
        prev.map((file, idx) => 
          idx === fileIndex 
            ? { ...file, status: 'complete', progress: 100 }
            : file
        )
      );

      toast({
        title: "Success",
        description: `${uploadingFile.file.name} uploaded successfully`
      });

      onUploadComplete?.();

    } catch (error: any) {
      setUploadingFiles(prev => 
        prev.map((file, idx) => 
          idx === fileIndex 
            ? { ...file, status: 'error' }
            : file
        )
      );

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload file"
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Medical Documents
          </CardTitle>
          <CardDescription>
            Upload medical reports, lab results, prescriptions, and other documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Document Description (Optional)</Label>
            <Input
              id="description"
              placeholder="e.g., Blood test results, X-ray report..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop the files here...</p>
            ) : (
              <div>
                <p className="font-medium mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports: PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB each, up to 5 files)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadingFiles.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Uploading Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadingFiles.map((uploadingFile, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <File className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{uploadingFile.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {uploadingFile.status === 'complete' && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                      {uploadingFile.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {uploadingFile.status === 'uploading' && (
                    <Progress value={uploadingFile.progress} className="mb-2" />
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {uploadingFile.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;