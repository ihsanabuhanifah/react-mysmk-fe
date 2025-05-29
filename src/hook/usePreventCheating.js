import { useEffect } from "react";

export const usePreventCheating = (onViolation) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const blockedKeys = [
        (e.ctrlKey && ["c", "v", "u"].includes(e.key.toLowerCase())),
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i"),
        e.key === "F12",
      ];

      if (blockedKeys.some(Boolean)) {
        e.preventDefault();
        alert("Perintah ini tidak diizinkan selama ujian.");
        onViolation?.("shortcut");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("Klik kanan dinonaktifkan selama ujian.");
      onViolation?.("contextmenu");
    };

    const handlePaste = (e) => {
      e.preventDefault();
      alert("Paste tidak diperbolehkan.");
      onViolation?.("paste");
    };

    const handleCopy = (e) => {
      e.preventDefault();
      alert("Copy tidak diperbolehkan.");
      onViolation?.("copy");
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("copy", handleCopy);
    };
  }, [onViolation]);
};
