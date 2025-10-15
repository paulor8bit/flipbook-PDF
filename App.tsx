import React, { useState, useCallback } from 'react';
import { createFlipbookPdf, createBookletPdf } from './services/pdfService';
import { LayoutPreview, BookletLayoutPreview } from './components/LayoutPreview';
import { FileUpload } from './components/FileUpload';
import { DownloadIcon, LoaderIcon, ResetIcon, BookIcon, BookletIcon } from './components/icons';

type Mode = 'flipbook' | 'livreto';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Mode>('flipbook');

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setProcessing(false);
    setError(null);
    if (outputPdfUrl) {
      URL.revokeObjectURL(outputPdfUrl);
    }
    setOutputPdfUrl(null);
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }, [outputPdfUrl]);

  const handleTabChange = (tab: Mode) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      handleReset();
    }
  };

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
      let pdfBytes;
      if (activeTab === 'flipbook') {
        pdfBytes = await createFlipbookPdf(selectedFile);
      } else { // activeTab === 'livreto'
        pdfBytes = await createBookletPdf(selectedFile);
      }
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOutputPdfUrl(url);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido durante o processamento.');
      setOutputPdfUrl(null);
    } finally {
      setProcessing(false);
    }
  }, [selectedFile, activeTab]);

  const TABS: { id: Mode; title: string; icon: React.ReactNode; description: string; fileDesc: string; cta: string; layoutDesc?: string; }[] = [
    { id: 'flipbook', title: 'Flipbook', icon: <BookIcon />, description: 'Transforme um PDF de qualquer tamanho em um flipbook de várias folhas. A cada 8 páginas do seu PDF, uma nova folha de impressão será criada. Após a primeira folha, o quadro 1 sempre usará a página 1 do PDF original.', fileDesc: 'PDF com qualquer número de páginas', cta: 'Criar Flipbook', layoutDesc: "Após a 1ª folha, o Quadro 1 sempre usa a Página 1 do original. Os outros quadros continuam a sequência (pág. 9, 10...)." },
    { id: 'livreto', title: 'Livreto', icon: <BookletIcon />, description: 'Reorganiza as páginas de um PDF de qualquer tamanho para impressão de livreto (montagem em sela). As páginas são pareadas (ex: última com primeira) para que, após a impressão frente e verso e dobra, fiquem na ordem correta.', fileDesc: 'PDF com qualquer número de páginas', cta: 'Criar Livreto' },
  ];
  
  const currentTab = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Criador de PDF para Impressão
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Reorganize seus PDFs para impressão em segundos.
          </p>
        </header>

        <div className="flex mb-[-1px] z-10 relative px-6">
            {TABS.map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all duration-300 rounded-t-lg ${activeTab === tab.id ? 'bg-slate-800/50 border-cyan-400 text-cyan-300' : 'bg-transparent border-transparent text-slate-400 hover:text-white'}`}>
                    {tab.icon}
                    {tab.title}
                 </button>
            ))}
        </div>

        <main className="bg-slate-800/50 rounded-2xl rounded-tl-none shadow-2xl shadow-slate-950/50 backdrop-blur-sm border border-slate-700 p-6 md:p-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-cyan-300">Layout por Página</h2>
            {activeTab === 'livreto' ? <BookletLayoutPreview /> : <LayoutPreview description={currentTab.layoutDesc!} />}
            <p className="text-sm text-slate-400 leading-relaxed">
              {currentTab.description}
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-6 h-full">
            <FileUpload onFileSelect={handleFileChange} disabled={processing || !!outputPdfUrl} selectedFile={selectedFile} description={currentTab.fileDesc} />
            
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
                  currentTab.cta
                )}
              </button>
            )}

            {outputPdfUrl && (
              <div className="space-y-4 text-center p-4 bg-green-500/10 border border-green-500 rounded-lg">
                <p className="font-semibold text-green-300">Seu PDF está pronto!</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={outputPdfUrl}
                    download={`${activeTab}-${selectedFile?.name || 'document.pdf'}`}
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