// worker.js
self.onmessage = function (e) {
    try {
      const code = e.data;
      const result = eval(code); // Jalankan kode yang dikirim
      self.postMessage({ type: 'log', message: result });
    } catch (error) {
      self.postMessage({ type: 'error', message: error.toString() });
    }
  };
  