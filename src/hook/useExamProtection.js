import { useEffect } from 'react';

export const useExamProtection = () => {
  // Fungsi untuk masuk ke mode fullscreen
  const enterFullscreen = () => {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (element.webkitRequestFullscreen) { /* Safari */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE11 */
      element.msRequestFullscreen();
    }
  };

  useEffect(() => {
    // Masuk ke mode fullscreen saat komponen mount
    enterFullscreen();

    // Handler untuk perubahan fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.msFullscreenElement) {
        enterFullscreen();
      }
    };

    // Tambahkan event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Cleanup function
    return () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return { enterFullscreen };
};