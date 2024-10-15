import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import useToast from './useToast';

export const useQrScanner = (cb) => {
  const [qrScanner, setQrScanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHasCamera, setIsHasCamera] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const toast = useToast();

  const qrScannerRef = useRef(null);

  const handleCheckCamera = async () => {
    const hasCamera = await QrScanner.hasCamera();
    const scanner = new QrScanner(qrScannerRef.current, (res) => {
      cb(res.data);
      // scanner.stop();
      // setIsCameraOpen(false);
    }, {
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });

    setIsHasCamera(hasCamera);
    // setIsLoading(false);
    setQrScanner(scanner)
  };

  const handleOpenCamera = async () => {
    try {
      await qrScanner.start();

      setIsCameraOpen(true);
    } catch (error) {
      toast({ description: 'Terjadi masalah pada kamera anda, silahkan cek dan coba kembali.', status: 'error' });
    }
  };

  const handleStopCamera = () => {
    if (qrScanner) {
      qrScanner.stop();
    }

    setIsCameraOpen(false);
  };

  useEffect(() => {
    if (qrScannerRef.current) {
      handleCheckCamera();
    }
    
    return () => {
      if (qrScanner?.destroy) {
        qrScanner.destroy();
      }
    };
  }, [qrScannerRef]);

  return {
    isLoading,
    isHasCamera,
    isCameraOpen,
    handleOpenCamera,
    handleStopCamera,
    ref: qrScannerRef,
  };
};