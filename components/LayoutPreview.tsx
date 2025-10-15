import React from 'react';
import { RotateIcon } from './icons';

interface FrameProps {
  pageNumber: number | string;
  isRotated?: boolean;
  finalPage?: number | string;
  colorClass?: string;
  label?: string;
}

const Frame: React.FC<FrameProps> = ({ pageNumber, isRotated, finalPage, colorClass = 'bg-cyan-500/20', label = 'Quadro' }) => (
  <div className={`relative flex flex-col items-center justify-center aspect-[210/297] rounded-md p-2 text-center transition-all duration-300 ${colorClass}`}>
    {isRotated && (
        <div className="absolute top-1 right-1 text-slate-400">
            <RotateIcon />
        </div>
    )}
    <div className={`flex flex-col items-center justify-center ${isRotated ? 'transform rotate-180' : ''}`}>
        {finalPage && <span className="text-xs text-slate-400">Página {finalPage}</span>}
        <span className="text-xl md:text-3xl font-bold text-slate-200">{pageNumber}</span>
    </div>
    <div className="absolute bottom-1 text-xs text-slate-500">{label}</div>
  </div>
);

export const LayoutPreview: React.FC<{description: string}> = ({description}) => {
  const layout = [
    { pageNumber: 3, isRotated: true, finalPage: 'C+2', colorClass: 'bg-purple-500/20' },
    { pageNumber: 2, isRotated: true, finalPage: 'C+1', colorClass: 'bg-purple-500/20' },
    { pageNumber: 1, isRotated: true, finalPage: 'C', colorClass: 'bg-purple-500/20' },
    { pageNumber: 8, isRotated: true, finalPage: 'C+7', colorClass: 'bg-purple-500/20' },
    { pageNumber: 4, isRotated: false, finalPage: 'C+3' },
    { pageNumber: 5, isRotated: false, finalPage: 'C+4' },
    { pageNumber: 6, isRotated: false, finalPage: 'C+5' },
    { pageNumber: 7, isRotated: false, finalPage: 'C+6' },
  ];

  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400 mb-2 text-center">{description}</p>
      <div className="grid grid-cols-4 gap-2">
        {layout.map((frame, index) => (
          <Frame key={index} {...frame} />
        ))}
      </div>
    </div>
  );
};

export const BookletLayoutPreview: React.FC = () => {
    const layout = [
      { pageNumber: 'Última', finalPage: 'N', colorClass: 'bg-green-500/20' },
      { pageNumber: '1', finalPage: '1', colorClass: 'bg-green-500/20' },
      { pageNumber: '2', finalPage: '2', colorClass: 'bg-purple-500/20' },
      { pageNumber: 'Penúltima', finalPage: 'N-1', colorClass: 'bg-purple-500/20' },
    ];
  
    return (
      <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 space-y-3">
          <p className="text-xs text-slate-400 text-center">As páginas são agrupadas em pares para formar os spreads.</p>
          <div className="grid grid-cols-2 gap-2">
            {layout.map((frame, index) => (
              <Frame key={index} {...frame} label="Página" />
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center">...e assim por diante, do centro para fora.</p>
      </div>
    );
  };