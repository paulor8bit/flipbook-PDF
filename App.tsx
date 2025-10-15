import React, { useState, useCallback } from 'react';
import { createFlipbookPdf } from './services/pdfService';
import { LayoutPreview } from './components/LayoutPreview';
import { FileUpload } from './components/FileUpload';
import { DownloadIcon, LoaderIcon, ResetIcon } from './components/icons';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Por favor, selecione um arquivo PDF válido.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      setOutputPdfUrl(null);
    }
  };

  const handleProcessClick = useCallback(async () => {
    if (!selectedFile) {
      setError('Nenhum arquivo selecionado.');
      return;
    }

    setProcessing(true);
    setError(null);
    setOutputPdfUrl(null);

    try {
      const pdfBytes = await createFlipbookPdf(selectedFile);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOutputPdfUrl(url);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido durante o processamento.');
      setOutputPdfUrl(null);
    } finally {
      setProcessing(false);
    }
  }, [selectedFile]);
  
  const handleReset = () => {
    setSelectedFile(null);
    setProcessing(false);
    setError(null);
    if(outputPdfUrl) {
      URL.revokeObjectURL(outputPdfUrl);
    }
    setOutputPdfUrl(null);
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Flipbook PDF
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Crie um flipbook para impressão a partir do seu PDF de 8 páginas em segundos.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-slate-950/50 backdrop-blur-sm border border-slate-700 p-6 md:p-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-cyan-300">Layout Final</h2>
            <LayoutPreview />
            <p className="text-sm text-slate-400 leading-relaxed">
              Seu PDF de 8 páginas será organizado em uma única página paisagem. A linha superior é impressa de cabeça para baixo. Isso permite que você imprima, corte, empilhe e dobre para criar um pequeno flipbook.
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-6 h-full">
            <FileUpload onFileSelect={handleFileChange} disabled={processing || !!outputPdfUrl} selectedFile={selectedFile} />
            
            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center animate-pulse">{error}</div>}

            {selectedFile && !outputPdfUrl && (
              <button
                onClick={handleProcessClick}
                disabled={processing}
                className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-900/50"
              >
                {processing ? (
                  <>
                    <LoaderIcon />
                    Processando...
                  </>
                ) : (
                  'Criar Flipbook'
                )}
              </button>
            )}

            {outputPdfUrl && (
              <div className="space-y-4 text-center p-4 bg-green-500/10 border border-green-500 rounded-lg">
                <p className="font-semibold text-green-300">Seu flipbook está pronto!</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={outputPdfUrl}
                    download={selectedFile ? `flipbook-${selectedFile.name}` : 'flipbook.pdf'}
                    className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-900/50"
                  >
                    <DownloadIcon />
                    Baixar PDF
                  </a>
                   <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                  >
                    <ResetIcon />
                    Começar de Novo
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;