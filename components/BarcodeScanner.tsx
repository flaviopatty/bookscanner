
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerProps {
    onDetected: (code: string) => void;
    onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let isStopped = false;

        const startScanner = async () => {
            try {
                const videoInputDevices = await codeReader.listVideoInputDevices();
                if (videoInputDevices.length === 0) {
                    setError("Nenhuma câmera encontrada.");
                    setIsLoading(false);
                    return;
                }

                // Tenta pegar a câmera traseira se disponível
                const backCamera = videoInputDevices.find(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('traseira')
                );

                const deviceId = backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId;

                await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
                    if (isStopped) return;
                    if (result) {
                        isStopped = true;
                        onDetected(result.getText());
                    }
                });

                setIsLoading(false);
            } catch (err) {
                console.error("Erro ao iniciar scanner:", err);
                setError("Erro ao acessar a câmera.");
                setIsLoading(false);
            }
        };

        startScanner();

        return () => {
            isStopped = true;
            codeReader.reset();
        };
    }, [onDetected]);

    return (
        <div className="fixed inset-0 z-[130] bg-black flex flex-col">
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-white font-bold text-xs uppercase tracking-widest">Iniciando Leitor...</p>
                    </div>
                )}

                {error ? (
                    <div className="flex flex-col items-center p-6 text-center">
                        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">videocam_off</span>
                        <p className="text-white font-bold mb-6">{error}</p>
                        <button onClick={onClose} className="px-8 py-3 bg-white rounded-full font-bold text-slate-900">Voltar</button>
                    </div>
                ) : (
                    <>
                        <video ref={videoRef} className="w-full h-full object-cover" />

                        {/* Overlay Guia */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                            <div className="w-full aspect-video max-w-sm border-2 border-white/50 rounded-2xl relative">
                                <div className="absolute inset-0 border-2 border-primary rounded-2xl animate-pulse"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center px-6">
                            <p className="text-white text-sm font-bold bg-black/40 backdrop-blur-md px-6 py-2 rounded-full mb-8">Posicione o código de barras na linha vermelha</p>
                            <button
                                onClick={onClose}
                                className="size-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
                            >
                                <span className="material-symbols-outlined text-3xl">close</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BarcodeScanner;
