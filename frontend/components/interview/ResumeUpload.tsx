'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ResumeUploadProps {
  onUploadSuccess: (text: string, fileName: string) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrorMessage('');

    if (rejectedFiles.length > 0) {
      const rej = rejectedFiles[0];
      if (rej.file.size > 10 * 1024 * 1024) {
        setStatus('error');
        setErrorMessage('File size exceeds 10MB limit.');
      } else {
        setStatus('error');
        setErrorMessage('Only PDF files are accepted.');
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setFileName(file.name);
    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume.');
      }

      const data = await response.json();
      if (data.success && data.resumeText) {
        setStatus('success');
        onUploadSuccess(data.resumeText, file.name);
      } else {
        throw new Error('No text content extracted from PDF.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred during resume processing.');
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-xl py-2 px-4 text-center flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
          isDragActive
            ? 'border-blue-500 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
            : status === 'success'
            ? 'border-emerald-500/50 bg-emerald-950/10'
            : status === 'error'
            ? 'border-red-500/50 bg-red-950/10'
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-750 hover:bg-slate-950/60'
        }`}
      >
        <input {...getInputProps()} />

        {status === 'idle' && (
          <div className="flex items-center justify-center gap-2.5 text-slate-300 select-none">
            <Upload className="w-4 h-4 text-slate-400" />
            <div className="text-[11px] font-semibold">
              <span className="text-blue-400 font-bold hover:underline">Click to upload resume PDF</span> or drag it here
              <span className="text-[9px] text-slate-500 font-medium ml-2 select-none">(Max 10MB)</span>
            </div>
          </div>
        )}

        {status === 'uploading' && (
          <div className="flex items-center justify-center gap-2.5 text-white font-semibold text-[11px]">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="font-mono uppercase tracking-wider text-[10px]">Parsing PDF...</span>
            <span className="text-slate-400 truncate max-w-[200px]">({fileName})</span>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-[11px] font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="font-mono uppercase tracking-wider text-[10px]">Resume Uploaded ✓</span>
            <span className="text-slate-300 max-w-[250px] truncate">({fileName})</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 text-red-400 text-[11px] font-semibold">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="font-mono uppercase tracking-wider text-[10px]">Upload Failed:</span>
            <span className="text-slate-300 truncate max-w-[200px]">{errorMessage}</span>
            <span className="text-blue-400 hover:underline cursor-pointer ml-1 text-[10px] font-bold">Try another file</span>
          </div>
        )}
      </div>
    </div>
  );
}
