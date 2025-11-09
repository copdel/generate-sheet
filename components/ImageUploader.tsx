
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedImage: string | null | undefined;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        alert("Please upload a valid image file (PNG, JPG, etc.).");
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-grow flex flex-col">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`flex-grow border-2 border-dashed rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors duration-300
          ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-700/20'}`
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        {uploadedImage ? (
          <div className="relative w-full h-full flex items-center justify-center">
             <img src={uploadedImage} alt="Uploaded character" className="max-w-full max-h-64 object-contain rounded-md" />
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-500 mb-2" />
            <p className="font-semibold">
              <span className="text-cyan-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">PNG, JPG, WEBP (Max 4MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
