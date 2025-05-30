import { useEffect, useState } from 'react';

export default function useForceFullscreen(targetRef) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const requestFullscreen = () => {
    const element = targetRef.current;
    if (element && !document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error('Gagal masuk fullscreen:', err);
      });
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      const fullscreen = !!document.fullscreenElement;
      setIsFullscreen(fullscreen);

      // if (!fullscreen) {
      //   // Re-minta fullscreen jika user keluar
      //   requestFullscreen();
      // }
    };

    // document.addEventListener('fullscreenchange', handleChange);
    // requestFullscreen(); // Minta pertama kali saat mount

    // return () => {
    //   document.removeEventListener('fullscreenchange', handleChange);
    //   exitFullscreen(); // Optional, keluar saat unmount
    // };
  }, [targetRef]);

  return isFullscreen;
}
