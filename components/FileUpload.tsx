
import React, { useRef, DragEvent, ChangeEvent } from 'react';
import { UploadIcon, PdfIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled: boolean;
  selectedFile: File | null;
  description: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled, selectedFile, description }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if(disabled) return;
    const file = e.dataTransfer.files?.[0] || null;
    onFileSelect(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  if (selectedFile && !disabled) {
    return (
      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-center justify-center text-center">
        <div className="flex items-center gap-3 text-slate-300">
            <PdfIcon />
            <span className="font-medium truncate">{selectedFile.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        onClick={disabled ? (e) => e.preventDefault() : handleClick}
        onDragOver={disabled ? undefined : handleDragOver}
        onDrop={disabled ? undefined : handleDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-slate-600 border-dashed rounded-lg group transition-colors ${
          disabled ? 'cursor-not-allowed bg-slate-800' : 'cursor-pointer bg-slate-700/50 hover:bg-slate-700'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-cyan-300 transition-colors">
          <UploadIcon />
          <p className="mb-2 text-sm">
            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
          </p>
          <p className="text-xs">{description}</p>
        </div>
        <input
          ref={inputRef}
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};
