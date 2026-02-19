
import React, { useRef, useState, useEffect } from 'react';
import { analyzeBookCover } from '../services/geminiService';
import { Book, ViewType } from '../types';

interface ScannerProps {
  onBookScanned: (book: Book) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onBookScanned, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        setError('Não foi possível acessar a câmera. Verifique as permissões.');
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');

      try {
        const result = await analyzeBookCover(imageData);
        const newBook: Book = {
          id: Date.now().toString(),
          title: result.title || 'Título Desconhecido',
          author: result.author || 'Autor Desconhecido',
          publisher: result.publisher || '',
          isbn: result.isbn || '',
          pageCount: result.pageCount,
          scannedAt: new Date().toISOString().split('T')[0],
          coverUrl: imageData,
        };
        onBookScanned(newBook);
      } catch (err: any) {
        setError(err.message || 'Falha ao analisar o livro. Tente novamente.');
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col max-w-md mx-auto overflow-hidden">
      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-lg font-bold">BookScanner</h1>
          <div className="flex items-center gap-1.5 px-3 py-1 mt-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className={`size-2 rounded-full bg-primary ${isScanning ? 'animate-pulse' : ''}`}></span>
            <span className="text-white text-[10px] font-bold uppercase tracking-widest">
              {isScanning ? 'Processando...' : 'Pronto'}
            </span>
          </div>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
          <span className="material-symbols-outlined">flash_on</span>
        </button>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover grayscale-[10%]"
        />

        {/* Scanning Viewfinder */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[80%] aspect-[3/4] relative rounded-2xl">
            {/* Corners */}
            <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-primary rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-primary rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-primary rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-primary rounded-br-2xl"></div>

            {/* Animated Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_#11c4d4] animate-[scan_3s_ease-in-out_infinite]"></div>

            {isScanning && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="bg-primary/20 border border-primary/40 px-6 py-3 rounded-xl text-white font-bold animate-pulse">
                  Analisando Capa...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="relative z-20 bg-white dark:bg-background-dark px-6 pt-10 pb-12 rounded-t-[2.5rem] -mt-10 shadow-2xl">
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-bold mb-6">
          Alinhe a capa do livro na moldura
        </p>

        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm filled-icon">auto_awesome</span>
            <span className="text-[10px] font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Alimentado por Gemini</span>
          </div>
        </div>

        <div className="flex items-center justify-between max-w-xs mx-auto">
          <label className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">photo_library</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                    const base64String = reader.result as string;
                    setIsScanning(true);
                    setError(null);
                    try {
                      const result = await analyzeBookCover(base64String);
                      onBookScanned({
                        id: Date.now().toString(),
                        title: result.title || 'Título Desconhecido',
                        author: result.author || 'Autor Desconhecido',
                        publisher: result.publisher || '',
                        isbn: result.isbn || '',
                        pageCount: result.pageCount,
                        scannedAt: new Date().toISOString().split('T')[0],
                        coverUrl: base64String,
                      });
                    } catch (err: any) {
                      setError(err.message || 'Falha ao analisar a imagem. Tente novamente.');
                    } finally {
                      setIsScanning(false);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>

          <button
            onClick={handleCapture}
            disabled={isScanning}
            className="relative flex items-center justify-center group"
          >
            <div className="absolute size-24 border-2 border-primary/30 rounded-full group-active:scale-110 transition-transform"></div>
            <div className="absolute size-20 border-4 border-primary/10 rounded-full"></div>
            <div className="size-16 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white transition-transform group-active:scale-90">
              <span className="material-symbols-outlined text-4xl">{isScanning ? 'hourglass_top' : 'camera'}</span>
            </div>
          </button>

          <button
            onClick={() => onBookScanned({ id: Date.now().toString(), title: '', author: '', scannedAt: new Date().toISOString().split('T')[0], coverUrl: '' })}
            className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>

        {error && (
          <p className="text-center mt-6 text-red-500 text-xs font-bold">{error}</p>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.5; }
          50% { top: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
