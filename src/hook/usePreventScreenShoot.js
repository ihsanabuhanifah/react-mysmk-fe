import { useEffect } from 'react';

export const usePreventScreenshot = (onViolation) => {
  useEffect(() => {
    // 1. Deteksi kombinasi tombol screenshot
    const handleKeyDown = (e) => {
      const screenshotShortcuts = [
        (e.ctrlKey && e.key === 'PrintScreen'),
        (e.metaKey && e.key === 'PrintScreen'), // Mac
        e.key === 'PrintScreen',
        (e.altKey && e.key === 'PrintScreen')
      ];

      if (screenshotShortcuts.some(Boolean)) {
        e.preventDefault();
        alert("Pengambilan screenshot tidak diizinkan selama ujian.");
        onViolation?.('screenshot_attempt');
        return false;
      }
    };

    // 2. Blokir right-click save dan dev tools
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
        e.preventDefault();
        alert("Penyimpanan gambar tidak diizinkan selama ujian.");
        onViolation?.('image_save_attempt');
        return false;
      }
    };

    // 3. Deteksi perubahan visibility (alt-tab)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("Anda tidak boleh berpindah aplikasi selama ujian.");
        onViolation?.('tab_switch');
      }
    };

    // 4. Blokir akses clipboard untuk gambar
    const handleCopy = (e) => {
      if (e.clipboardData.types.includes('Files')) {
        e.preventDefault();
        alert("Copy gambar tidak diizinkan.");
        onViolation?.('image_copy_attempt');
      }
    };

    // Pasang event listeners
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy, true);

    // 5. Tambahkan CSS anti-screenshot
    const antiScreenshotStyle = `
      .exam-content {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      .exam-content img {
        pointer-events: none;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = antiScreenshotStyle;
    document.head.appendChild(styleElement);

    return () => {
      // Cleanup
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy, true);
      document.head.removeChild(styleElement);
    };
  }, [onViolation]);

  useEffect(() => {
  const handleResize = () => {
    if (window.outerWidth !== window.innerWidth || 
        window.outerHeight !== window.innerHeight) {
      alert("Aplikasi screen capture terdeteksi!");
      onViolation?.('screen_capture_detected');
    }
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [onViolation]);

useEffect(() => {
  const handleDevToolsOpen = (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
      alert("Developer tools tidak diizinkan selama ujian.");
      onViolation?.('devtools_attempt');
      return false;
    }
  };

  document.addEventListener('keydown', handleDevToolsOpen, true);
  return () => document.removeEventListener('keydown', handleDevToolsOpen, true);
}, [onViolation]);
};