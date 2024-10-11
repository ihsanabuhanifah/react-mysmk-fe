import React from "react";
import { useQrScanner } from "../../../hook/useQrScanner";

const ScanKehadiran = () => {
  const handleScanResult = (result) => {
    const validJsonString = result.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
    
  };

  const {
    isLoading,
    isHasCamera,
    isCameraOpen,
    handleOpenCamera,
    handleStopCamera,
    ref,
  } = useQrScanner(handleScanResult);

  return (
    <div className="qr-scanner-container flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Scan QR Kehadiran
        </h1>

        <div className="relative mb-4">
          <video
            ref={ref}
            className="w-full h-64 bg-gray-200 rounded-md shadow-inner object-cover"
          ></video>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold">
              Loading Camera...
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          {!isCameraOpen ? (
            <button
              onClick={handleOpenCamera}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={handleStopCamera}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Stop Camera
            </button>
          )}
        </div>

        {!isHasCamera && (
          <p className="mt-4 text-red-500 text-center">
            Your device does not have a camera.
          </p>
        )}
      </div>
    </div>
  );
};

export default ScanKehadiran;
