
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, File, X, Eye } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview?: string;
  ocrText?: string;
  uploading?: boolean;
  uploaded?: boolean;
  progress?: number;
}

interface DocumentUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onFilesUploaded, 
  maxFiles = 5, 
  maxSize = 10 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const processOCR = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('ocr-process', {
        body: formData
      });

      if (error) throw error;
      return data?.text || '';
    } catch (error) {
      console.error('OCR processing failed:', error);
      return '';
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidSize = file.size <= maxSize * 1024 * 1024; // Convert MB to bytes
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type);

      if (!isValidSize) {
        toast({
          title: "Plik za duży",
          description: `Plik ${file.name} przekracza limit ${maxSize}MB`,
          variant: "destructive",
        });
        return false;
      }

      if (!isValidType) {
        toast({
          title: "Nieobsługiwany format",
          description: `Plik ${file.name} nie jest w obsługiwanym formacie (PDF, JPG, PNG)`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      toast({
        title: "Za dużo plików",
        description: `Możesz wgrać maksymalnie ${maxFiles} plików`,
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploading: true,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (let i = 0; i < newFiles.length; i++) {
      const fileIndex = uploadedFiles.length + i;
      
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedFiles(prev => 
            prev.map((f, idx) => 
              idx === fileIndex ? { ...f, progress } : f
            )
          );
        }

        // Process OCR if it's an image or PDF
        let ocrText = '';
        if (newFiles[i].file.type.startsWith('image/') || newFiles[i].file.type === 'application/pdf') {
          ocrText = await processOCR(newFiles[i].file);
        }

        setUploadedFiles(prev => 
          prev.map((f, idx) => 
            idx === fileIndex 
              ? { ...f, uploading: false, uploaded: true, ocrText }
              : f
          )
        );

      } catch (error) {
        setUploadedFiles(prev => 
          prev.map((f, idx) => 
            idx === fileIndex 
              ? { ...f, uploading: false, uploaded: false }
              : f
          )
        );

        toast({
          title: "Błąd uploadu",
          description: `Nie udało się wgrać pliku ${newFiles[i].file.name}`,
          variant: "destructive",
        });
      }
    }

    onFilesUploaded(uploadedFiles);
  }, [uploadedFiles, maxFiles, maxSize, onFilesUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles,
    maxSize: maxSize * 1024 * 1024
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      onFilesUploaded(newFiles);
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Wgraj dokumenty
          </CardTitle>
          <CardDescription>
            Obsługujemy pliki PDF oraz zdjęcia (JPG, PNG). Maksymalny rozmiar: {maxSize}MB na plik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Upuść pliki tutaj...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Przeciągnij pliki tutaj lub kliknij, aby wybrać
                </p>
                <Button variant="outline">Wybierz pliki</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Wgrane pliki ({uploadedFiles.length}/{maxFiles})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {uploadedFile.preview ? (
                      <img 
                        src={uploadedFile.preview} 
                        alt={uploadedFile.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <File className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                    
                    {uploadedFile.uploading && (
                      <div className="mt-2">
                        <Progress value={uploadedFile.progress || 0} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Przetwarzanie... {uploadedFile.progress || 0}%
                        </p>
                      </div>
                    )}
                    
                    {uploadedFile.uploaded && uploadedFile.ocrText && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600">✓ Tekst rozpoznany ({uploadedFile.ocrText.length} znaków)</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadedFile.ocrText && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Show OCR text in modal or expand
                          toast({
                            title: "Rozpoznany tekst",
                            description: uploadedFile.ocrText.substring(0, 200) + "...",
                          });
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
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
