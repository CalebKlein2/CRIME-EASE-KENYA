import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud, X, FileText, File, FileImage, FileAudio, FileVideo } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';

export type EvidenceType = 'image' | 'video' | 'audio' | 'document';
export type EvidenceFile = {
  id: string;
  file: File;
  type: EvidenceType;
  preview?: string;
  progress: number;
  uploaded: boolean;
  url?: string;
  error?: string;
  isStatement?: boolean;
};

interface EvidenceUploaderProps {
  onFilesChange: (files: EvidenceFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: EvidenceType[];
  label?: string;
  description?: string;
  caseId?: string;
}

export function EvidenceUploader({
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = ['image', 'video', 'audio', 'document'],
  label = 'Upload Evidence',
  description = 'Drag and drop files here or click to browse',
  caseId,
}: EvidenceUploaderProps) {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const determineFileType = (file: File): EvidenceType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const generateAcceptString = (): string => {
    const typeMap: Record<EvidenceType, string> = {
      image: 'image/*',
      video: 'video/*',
      audio: 'audio/*',
      document: '.pdf,.doc,.docx,.txt'
    };
    
    return acceptedTypes.map(type => typeMap[type]).join(',');
  };

  const createPreview = (file: File, type: EvidenceType): string | undefined => {
    if (type === 'image') {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const filesToAdd: EvidenceFile[] = [];
    
    Array.from(newFiles).forEach((file) => {
      if (files.length + filesToAdd.length >= maxFiles) return;
      
      const fileType = determineFileType(file);
      if (!acceptedTypes.includes(fileType)) return;
      
      filesToAdd.push({
        id: Math.random().toString(36).substring(2, 11),
        file,
        type: fileType,
        preview: createPreview(file, fileType),
        progress: 0,
        uploaded: false,
      });
    });
    
    const updatedFiles = [...files, ...filesToAdd];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, maxFiles, acceptedTypes, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleRemoveFile = useCallback((id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Function to upload a file to Supabase Storage
  const uploadToStorage = async (file: EvidenceFile): Promise<EvidenceFile> => {
    if (!caseId) return { ...file, error: 'No case ID provided' };
    
    const path = `evidence/${caseId}/${file.type}/${Date.now()}-${file.file.name}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('crime-evidence')
        .upload(path, file.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('crime-evidence')
        .getPublicUrl(path);
      
      return {
        ...file,
        progress: 100,
        uploaded: true,
        url: publicUrl,
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return {
        ...file,
        progress: 0,
        uploaded: false,
        error: error.message || 'Upload failed',
      };
    }
  };

  // Function to upload all files
  const uploadAllFiles = async () => {
    if (!caseId) {
      console.error('Cannot upload files: No case ID provided');
      return;
    }
    
    const uploadPromises = files.map(async (file) => {
      if (file.uploaded) return file;
      
      // Update progress to show uploading state
      setFiles(prev => 
        prev.map(f => f.id === file.id ? { ...f, progress: 10 } : f)
      );
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id && f.progress < 90 
              ? { ...f, progress: f.progress + 10 } 
              : f
          )
        );
      }, 300);
      
      try {
        const result = await uploadToStorage(file);
        clearInterval(progressInterval);
        return result;
      } catch (error) {
        clearInterval(progressInterval);
        return {
          ...file, 
          progress: 0, 
          uploaded: false, 
          error: 'Upload failed'
        };
      }
    });
    
    const uploadedFiles = await Promise.all(uploadPromises);
    setFiles(uploadedFiles);
    onFilesChange(uploadedFiles);
  };

  const getFileIcon = (type: EvidenceType) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-10 h-10 text-blue-500" />;
      case 'video':
        return <FileVideo className="w-10 h-10 text-purple-500" />;
      case 'audio':
        return <FileAudio className="w-10 h-10 text-green-500" />;
      case 'document':
        return <FileText className="w-10 h-10 text-orange-500" />;
      default:
        return <File className="w-10 h-10 text-gray-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col">
        <Label className="mb-2">{label}</Label>
        <div
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={generateAcceptString()}
            onChange={handleChange}
            multiple
          />
          <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-1">{description}</p>
          <p className="text-xs text-gray-500">
            {acceptedTypes.join(', ')} files up to 10MB
          </p>
          {maxFiles > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {files.length}/{maxFiles} files
            </p>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-md p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {file.type === 'image' && file.preview ? (
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-medium truncate" title={file.file.name}>
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.progress > 0 && file.progress < 100 && (
                    <Progress value={file.progress} className="w-20" />
                  )}
                  {file.uploaded && (
                    <span className="text-xs text-green-600">Uploaded</span>
                  )}
                  {file.error && (
                    <span className="text-xs text-red-600">{file.error}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {caseId && files.some(f => !f.uploaded) && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                uploadAllFiles();
              }}
              className="mt-2"
            >
              Upload All Files
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
