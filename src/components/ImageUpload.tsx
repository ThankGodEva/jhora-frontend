'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  onUpload: (file: File) => void;
  preview?: string | null;  // ← add | null here
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({ label, onUpload, preview }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-orange-600 bg-orange-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="space-y-2">
            <img src={preview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
            <p className="text-sm text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, max 5MB</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          id={`file-${label}`}
        />
        <label
          htmlFor={`file-${label}`}
          className="mt-4 inline-block cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Choose file
        </label>
      </div>
    </div>
  );
}