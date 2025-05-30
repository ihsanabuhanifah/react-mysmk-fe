import { useEffect } from "react";
import { usePreventScreenshot } from "./usePreventScreenShoot";

export const usePreventCheating = (onViolation) => {
  // Aktifkan pencegahan screenshot
  // usePreventScreenshot(onViolation);

  useEffect(() => {
    // Daftar semua kombinasi tombol yang diblokir
    const handleKeyDown = (e) => {
      const blockedCombinations = [
        // Kombinasi Ctrl + *
        (e.ctrlKey && ["a", "c", "x", "v", "z", "y", "s", "p", "u", "i", "o", "w", "f", "h"].includes(e.key.toLowerCase())),
        
        // Kombinasi Alt + *
        (e.altKey && ["tab", "f4", "f5", "f1", "f2", "f3", "f6", "f7", "f8", "f9", "f10", "f11", "f12"].includes(e.key.toLowerCase())),
        
        // Kombinasi Windows/Command + *
        (e.metaKey && ["r", "d", "l", "t", "n", "h", "q", "w", "f", "p", "s", "o", "c", "v"].includes(e.key.toLowerCase())),
        
        // Kombinasi Shift + *
        (e.shiftKey && ["f10", "f11", "f12", "insert", "delete"].includes(e.key.toLowerCase())),
        
        // Kombinasi multi-tombol
        (e.ctrlKey && e.shiftKey && ["i", "j", "n", "t", "q", "r", "p", "s", "o"].includes(e.key.toLowerCase())),
        (e.altKey && e.shiftKey && ["tab", "f4"].includes(e.key.toLowerCase())),
        
        // Tombol khusus
        e.key === "Escape",
        e.key === "F1",
        e.key === "F2",
        e.key === "F3",
        e.key === "F4",
        e.key === "F5",
        e.key === "F6",
        e.key === "F7",
        e.key === "F8",
        e.key === "F9",
        e.key === "F10",
        e.key === "F11",
        e.key === "F12",
        e.key === "PrintScreen",
        e.key === "ScrollLock",
        e.key === "Pause",
        e.key === "Insert",
        e.key === "Delete",
        e.key === "Home",
        e.key === "End",
        e.key === "PageUp",
        e.key === "PageDown",
        e.key === "ContextMenu"
      ];

      if (blockedCombinations.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Klasifikasikan jenis pelanggaran
        if (e.key === "Escape") {
          alert("Tombol Escape tidak diizinkan selama ujian.");
          onViolation?.("escape");
        } 
        else if (e.key === "PrintScreen" || e.key === "f12") {
          alert("Pengambilan screenshot tidak diizinkan.");
          onViolation?.("screenshot_attempt");
        }
        else if (e.ctrlKey || e.metaKey || e.altKey) {
          alert(`Kombinasi tombol ${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.metaKey ? 'Cmd+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key} tidak diizinkan.`);
          onViolation?.("keyboard_shortcut");
        }
        else {
          alert(`Tombol ${e.key} tidak diizinkan selama ujian.`);
          onViolation?.("restricted_key");
        }
        
        return false;
      }
    };

    // Blokir klik kanan
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("Klik kanan dinonaktifkan selama ujian.");
      onViolation?.("contextmenu");
      return false;
    };

    // Blokir paste
    const handlePaste = (e) => {
      e.preventDefault();
      alert("Paste tidak diperbolehkan.");
      onViolation?.("paste");
      return false;
    };

    // Blokir copy
    const handleCopy = (e) => {
      e.preventDefault();
      alert("Copy tidak diperbolehkan.");
      onViolation?.("copy");
      return false;
    };

    // Blokir cut
    const handleCut = (e) => {
      e.preventDefault();
      alert("Cut tidak diperbolehkan.");
      onViolation?.("cut");
      return false;
    };

    // Blokir drag-and-drop
    const handleDragStart = (e) => {
      e.preventDefault();
      alert("Drag-and-drop tidak diizinkan.");
      onViolation?.("drag_drop");
      return false;
    };

    // Pasang semua event listeners dengan capture phase
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("paste", handlePaste, true);
    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("cut", handleCut, true);
    document.addEventListener("dragstart", handleDragStart, true);

    // Tambahkan CSS untuk mencegah seleksi teks
    const noSelectStyle = `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    const style = document.createElement('style');
    style.innerHTML = noSelectStyle;
    document.head.appendChild(style);

    return () => {
      // Cleanup
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("paste", handlePaste, true);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCut, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.head.removeChild(style);
    };
  }, [onViolation]);
};