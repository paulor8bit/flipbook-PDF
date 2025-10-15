
import React from 'react';
import { RotateIcon } from './icons';

interface FrameProps {
  pageNumber: number;
  isRotated: boolean;
  finalPage: number;
}

const Frame: React.FC<FrameProps> = ({ pageNumber, isRotated, finalPage }) => (
  <div className={`relative flex flex-col items-center justify-center aspect-[210/297] rounded-md p-2 text-center transition-all duration-300 ${isRotated ? 'bg-purple-500/20' : 'bg-cyan-500/20'}`}>
    <div className="absolute top-1 right-1 text-slate-400">
      {isRotated && <RotateIcon />}
    </div>
    <div className={`flex flex-col items-center justify-center ${isRotated ? 'transform rotate-180' : ''}`}>
        <span className="text-xs text-slate-400">Página {finalPage}</span>
        <span className="text-3xl font-bold text-slate-200">{pageNumber}</span>
    </div>
    <div className="absolute bottom-1 text-xs text-slate-500">Quadro</div>
  </div>
);

export const LayoutPreview: React.FC = () => {
  const layout = [
    { pageNumber: 3, isRotated: true, finalPage: 3 },
    { pageNumber: 2, isRotated: true, finalPage: 2 },
    { pageNumber: 1, isRotated: true, finalPage: 1 },
    { pageNumber: 8, isRotated: true, finalPage: 8 },
    { pageNumber: 4, isRotated: false, finalPage: 4 },
    { pageNumber: 5, isRotated: false, finalPage: 5 },
    { pageNumber: 6, isRotated: false, finalPage: 6 },
    { pageNumber: 7, isRotated: false, finalPage: 7 },
  ];

  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
      <div className="grid grid-cols-4 gap-2">
        {layout.map((frame, index) => (
          <Frame key={index} {...frame} />
        ))}
      </div>
    </div>
  );
};