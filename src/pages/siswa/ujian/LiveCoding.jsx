import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import clsx from "clsx";

function LiveCodingPlayground({
  setPayload,
  setJawaban,
  payload,
  handleSoal,
  item,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [html, setHtml] = useState("<h1>ok</h1>");
  const [css, setCss] = useState("");
  console.log("html", html);
  const [js, setJs] = useState("");
  const [logs, setLogs] = useState([]);
  const iframeRef = useRef(null);
  const [code, setCode] = useState(true);

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

  useEffect(() => {
    const detail = handleSoal(payload, item);
    setPayload((s) => {
      s.data[detail.index] = {
        ...detail.soal[0],
        jawaban: JSON.stringify({
          html: html,
          css: css,
          js: js,
          logs: logs,
        }),
      };
      setJawaban(() => {
        return JSON.stringify({
          html: html,
          css: css,
          js: js,
          logs: logs,
        });
      });
      return {
        ...s,
        data: s.data,
      };
    });
  }, [html, css, js]);

  useEffect(() => {
    const detail = handleSoal(payload, item);

    const jawaban = JSON.parse(payload.data[detail.index].jawaban);

    setHtml(jawaban.html || "");
    setCss(jawaban.css || "");
    setJs(jawaban.js || "");
    // setLogs(jawaban || "");

    setIsLoading(false)

    console.log("jawbaan", jawaban);
  }, []);


 

  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden rounded-lg bg-gray-900 text-white">
      <header className="w-full bg-gray-800 py-4 text-center text-lg font-semibold shadow-lg">
        <h1>Live Coding Playground</h1>
      </header>

      <div className="flex w-full flex-col gap-4 p-4 lg:flex-row">
        <div
          className={clsx({
            "grid w-full grid-cols-2 gap-5": code,
            hidden: code === false,
          })}
        >
          <div className="editor rounded-lg bg-gray-800 p-4">
            <h5 className="mb-2 text-sm font-bold text-gray-400">HTML</h5>
            <Editor
              height="450px"
              defaultLanguage="html"
              value={html}
              onChange={(value) => setHtml(value || "")}
              theme="vs-dark"
            />
          </div>

          <div className="editor rounded-lg bg-gray-800 p-4">
            <h5 className="mb-2 text-sm font-bold text-gray-400">CSS</h5>
            <Editor
              height="450px"
              defaultLanguage="css"
              value={css}
              onChange={(value) => setCss(value || "")}
              theme="vs-dark"
            />
          </div>

          <div className="editor rounded-lg bg-gray-800 p-4">
            <h5 className="mb-2 text-sm font-bold text-gray-400">JavaScript</h5>
            <Editor
              height="450px"
              defaultLanguage="javascript"
              value={js}
              onChange={(value) => setJs(value || "")}
              theme="vs-dark"
            />
          </div>
        </div>

        <div
          className={clsx(
            "grid h-full w-full grid-cols-12 gap-2 rounded-lg bg-gray-800 p-2",
            {
              hidden: code === true,
            },
          )}
        >
          <iframe
            ref={iframeRef}
            id="code"
            title="Live Output"
            className="col-span-9 w-full rounded-lg bg-white"
            style={{ height: "550px" }}
          />

          <div className="col-span-3 rounded-lg border p-2">
            <h5 className="mb-2 text-sm font-bold text-gray-400">
              Console Output
            </h5>
            <div className="h-[500px] overflow-auto rounded-lg bg-black p-4 text-white">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-xs">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveCodingPlayground;
