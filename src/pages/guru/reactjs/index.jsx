// import React, { useState, Suspense, useCallback, useEffect } from "react";
// import { LiveProvider, LiveError, LivePreview } from "react-live";
// import "./styles.css";

// const MonacoEditor = React.lazy(() => import("@monaco-editor/react")); // Lazy load Monaco Editor
// const scope = { React };

// function ReactLivePlayground() {
//   const [code, setCode] = useState(``);
//   const [typing, setTyping] = useState(``);

//   // Use callback to debounce code changes
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setCode(typing);
//     }, 1000); // Adjust debounce delay as needed
//     return () => clearTimeout(timeoutId);
//   }, [typing]);

//   return (
//     <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 p-4">
//       <h1 className="mb-4 text-3xl font-bold">React Live Playground</h1>

//       <LiveProvider code={code} scope={scope}>
//         <div className="flex h-full w-full max-w-7xl flex-col gap-4 lg:flex-row">
//           {/* Monaco Editor with Lazy Loading and Suspense */}
//           <div className="h-1/2 w-full overflow-hidden rounded-lg bg-gray-800 shadow-lg lg:h-full lg:w-1/2">
//             <Suspense
//               fallback={<div className="p-4 text-white">Loading Editor...</div>}
//             >
             
             
//               <MonacoEditor
//                 height="100%"
//                 language="javascript"
//                 theme="vs-dark"
//                 value={typing}
//                 onChange={(v) => {
//                   setTyping(v);
//                 }}
//                 options={{
//                   fontSize: 14,
//                   minimap: { enabled: false },
//                   scrollBeyondLastLine: false,
//                   wordWrap: "on",
//                   automaticLayout: true,
//                 }}
//               />
//             </Suspense>
//           </div>

//           {/* Preview */}
//           <div className="h-1/2 w-full overflow-auto rounded-lg bg-white p-4 shadow-lg lg:h-full lg:w-1/2">
//             <div className="mb-4 border-b border-gray-300 pb-2">
//               <h2 className="text-xl font-semibold">Preview</h2>
//             </div>
//             <LivePreview className="h-full rounded-lg bg-gray-50 p-2" />
//           </div>
//         </div>

//         {/* Error */}
//         <div className="mt-4 w-full max-w-7xl">
//           <LiveError className="rounded-md bg-red-100 p-2 text-sm text-red-500" />
//         </div>
//       </LiveProvider>
//     </div>
//   );
// }


// export default ReactLivePlayground;



// // export default function App() {
// //     return (
// //       <div>
// //         <h1 className="text-2xl font-bold mb-4">PlayCode Iframe Example</h1>
// //         <iframe
// //           src="https://playcode.io/react_ts_hooks"
// //           width="100%" // Atur lebar iframe sesuai dengan kontainer
// //           height="600px" // Atur tinggi iframe sesuai kebutuhan
// //           style={{ border: "none" }} // Hilangkan border default
// //           title="PlayCode Example" // Tambahkan title untuk aksesibilitas
// //         />
// //       </div>
// //     );
// //   }
  