import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import clsx from "clsx";

function LiveCodingPlayground() {
 
  const [html, setHtml] = useState("<h1>ok</h1>");
  const [css, setCss] = useState("");
 
  const [js, setJs] = useState("");
  const [logs, setLogs] = useState([]);
  const iframeRef = useRef(null);
  const [code, setCode] = useState(true);

  let [htmlCode, setHtmlCode] = useState(1);
  let [cssCode, setCssCode] = useState(0);
  let [jsCode, setJsCode] = useState(0);

  const [iframeHeight, setIframeHeight] = useState(600); // Set default height
  const [iframeWidth, setIframeWidth] = useState("100%"); 
  // Set default width

  const logHandler = useCallback((type, message) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      `${type === "log" ? "Log" : "Error"}: ${message}`,
    ]);
  }, []);

  useEffect(() => {
    // if (isLoading) {
    //   return;
    // }
    // Kosongkan log setiap kali terjadi perubahan pada HTML, CSS, atau JavaScript
    setLogs([]);

    const document = iframeRef.current.contentDocument;

    // Define console override and error handling script
    const consoleOverride = `
      (function() {
        const log = console.log;
        console.log = function(...args) {
          let message = args.map(arg => {
            if (typeof arg === 'string') return arg;
            if (typeof arg === 'number') return \`Number: \${arg}\`;
            if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
            return String(arg);
          }).join(' ');

          window.parent.postMessage({ type: 'log', message: message }, '*');
          log.apply(console, args);
        };

        window.onerror = function(message, source, lineno, colno, error) {
          window.parent.postMessage({ type: 'error', message: message }, '*');
        };
        
        try {
          ${js}
        } catch (error) {
          window.parent.postMessage({ type: 'error', message: error.toString() }, '*');
        }
      })();
    `;

    // Tambahkan Tailwind CDN ke <head> iframe
    const documentContent = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>${css}</style>
        </head>
        <body class="bg-gray-100">
          ${html}
          <script>${consoleOverride}<\/script>
        </body>
      </html>
    `;

    document.open();
    document.write(documentContent);
    document.close();

    const messageHandler = (event) => {
      if (event.data.type === "log") {
        logHandler("log", event.data.message);
      } else if (event.data.type === "error") {
        logHandler("error", event.data.message);
      }
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [html, css, js]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "c") {
        setCode((prevCode) => !prevCode);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const MIN_HEIGHT = 100; // Ganti sesuai dengan kebutuhan Anda
  const MIN_WIDTH = 200;

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = iframeHeight;

    const handleMouseMove = (e) => {
      const newHeight = startHeight + e.clientY - startY;
      setIframeHeight(Math.max(newHeight, MIN_HEIGHT)); // Set minimum height
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeWidth = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = parseInt(
      window.getComputedStyle(iframeRef.current).width,
      10,
    );

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setIframeWidth(Math.max(newWidth, MIN_WIDTH) + "px"); // Set minimum width
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  

  
  return (
    <div className="flex min-h-screen flex-col items-center overflow-auto overflow-hidden  bg-gray-900 text-white">
      <header className="item-center flex pl-5 w-full  py-2 justify-between bg-gray-800 text-center text-lg font-semibold shadow-lg">
      <div className="py-2">
      <h3 >SMK MADINATULQURAN LIVE CODING </h3>
      </div>
        <div>
          <button
            className={clsx(
              "rounded-t-md border-b-2 px-4 py-2 font-semibold transition-all duration-300",
              htmlCode === 1
                ? "border-blue-400 bg-gray-800 text-white"
                : "border-transparent bg-gray-700 text-gray-400 hover:bg-gray-600",
            )}
            onClick={() => {
              setHtmlCode((i) => (i === 1 ? 0 : 1));
            }}
          >
            HTML 
          </button>

          <button
            className={clsx(
              "rounded-t-md border-b-2 px-4 py-2 font-semibold transition-all duration-300",
              cssCode === 1
                ? "border-green-400 bg-gray-800 text-white"
                : "border-transparent bg-gray-700 text-gray-400 hover:bg-gray-600",
            )}
            onClick={() => {
              setCssCode((i) => (i === 1 ? 0 : 1));
            }}
          >
            CSS
          </button>

          <button
            className={clsx(
              "rounded-t-md border-b-2 px-4 py-2 font-semibold transition-all duration-300",
              jsCode === 1
                ? "border-yellow-400 bg-gray-800 text-white"
                : "border-transparent bg-gray-700 text-gray-400 hover:bg-gray-600",
            )}
            onClick={() => {
              setJsCode((i) => (i === 1 ? 0 : 1));
            }}
          >
            JavaScript
          </button>

          <button
            className={clsx(
              "rounded-t-md border-b-2 px-4 py-2 font-semibold transition-all duration-300",
              code === false
                ? "border-red-400 bg-gray-800 text-white"
                : "border-transparent bg-gray-700 text-gray-400 hover:bg-gray-600",
            )}
            onClick={() => {
              setCode((c) => !code);
            }}
          >
            Preview
          </button>
        </div>
      </header>

      <div className="flex w-full flex-col gap-4 overflow-auto p-4 lg:flex-row">
        <div
          className={clsx({
            "grid w-full gap-5": code,
            hidden: code === false,
            "grid-cols-3": htmlCode + cssCode + jsCode === 3,
            "grid-cols-2": htmlCode + cssCode + jsCode === 2,
            "grid-cols-1": htmlCode + cssCode + jsCode === 1,
          })}
        >
          {htmlCode === 1 && (
            <>
              {" "}
              <div className="editor rounded-lg bg-gray-800 p-4">
                <h5 className="mb-2 text-sm font-bold text-gray-400">HTML</h5>
                <Editor
                  height="600px"
                  defaultLanguage="html"
                  value={html}
                  onChange={(value) => setHtml(value || "")}
                  theme="vs-dark"
                />
              </div>
            </>
          )}

          {cssCode === 1 && (
            <div className="editor rounded-lg bg-gray-800 p-4">
              <h5 className="mb-2 text-sm font-bold text-gray-400">CSS</h5>
              <Editor
                height="600px"
                defaultLanguage="css"
                value={css}
                onChange={(value) => setCss(value || "")}
                theme="vs-dark"
              />
            </div>
          )}

          {jsCode === 1 && (
            <div className="editor rounded-lg bg-gray-800 p-4">
              <h5 className="mb-2 text-sm font-bold text-gray-400">
                JavaScript
              </h5>
              <Editor
                height="600px"
                defaultLanguage="javascript"
                value={js}
                onChange={(value) => setJs(value || "")}
                theme="vs-dark"
              />
            </div>
          )}
        </div>

        <div
          className={clsx(
            "relative grid h-full w-full rounded-lg bg-gray-800 p-2",
            {
              hidden: code === true,
            },
          )}
        >
         
          <iframe
            onMouseDown={handleMouseDown}
            ref={iframeRef}
            id="code"
            title="Live Output"
            className="resize-handle h-full rounded-lg bg-white"
            style={{ height: `${iframeHeight}px`, width: iframeWidth }} // Set dynamic width
          />

{/* <div  className="crounded-lg relative right-0  w-[300px] p-2">
            <h5 className="mb-2 text-sm font-bold text-gray-400">
              Console Output
            </h5>
            <div className="h-[80vh] overflow-auto rounded-lg bg-black p-4 text-white">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-xs">
                  {log}
                </div>
              ))}
            </div>
          </div> */}
          <div
            onMouseDown={handleResizeWidth}
            className="cu absolute right-0 top-0 h-full w-[20%] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default LiveCodingPlayground;
