// src/components/forms/FileUploader.tsx
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Upload, X, Check, Loader2, AlertCircle, File } from "lucide-react";
import { Progress } from "../ui/progress";

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  acceptedFileTypes?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  label?: string;
}

export function FileUploader({
  onUpload,
  acceptedFileTypes = "image/*,video/*,audio/*,.pdf,.doc,.docx",
  maxFiles = 5,
  maxFileSize = 50, // 50MB default max size
  label = "Upload Evidence",
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    // Check if exceeding max files
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    // Check file sizes
    const invalidFiles = selectedFiles.filter(
      (file) => file.size > maxFileSize * 1024 * 1024
    );
    if (invalidFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxFileSize}MB.`);
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Check if exceeding max files
    if (droppedFiles.length + files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    // Check file sizes
    const invalidFiles = droppedFiles.filter(
      (file) => file.size > maxFileSize * 1024 * 1024
    );
    if (invalidFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxFileSize}MB.`);
      return;
    }

    setFiles((prev) => [...prev, ...droppedFiles]);
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(timer);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      await onUpload(files);
      
      clearInterval(timer);
      setProgress(100);
      
      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploading(false);
        setProgress(0);
      }, 1000);
      
    } catch (err) {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return '🖼️';
    } else if (['mp4', 'mov', 'avi'].includes(extension || '')) {
      return '🎥';
    } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
      return '🔊';
    } else if (['pdf'].includes(extension || '')) {
      return '📄';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return '📝';
    }
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
        } transition-colors`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here or click to browse
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Accepted formats: images, videos, audio, PDFs, and documents. Max {maxFileSize}MB per file.
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading || files.length >= maxFiles}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || files.length >= maxFiles}
          >
            Choose Files
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Selected Files ({files.length}/{maxFiles})
          </h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <div className="text-lg">{getFileIcon(file.name)}</div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>

          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
            </div>
          ) : (
            <Button onClick={handleUpload} className="w-full">
              Upload {files.length} {files.length === 1 ? "File" : "Files"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}