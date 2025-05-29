// import React, { useState, useEffect } from "react";
// import initSqlJs from "sql.js";
// import Editor from "@monaco-editor/react";

// function LiveMySQL() {
//   const [query, setQuery] = useState("");
//   const [result, setResult] = useState(null);
//   const [db, setDb] = useState(null);
//   const [sqlInstance, setSqlInstance] = useState(null); 
//   const [selectedText, setSelectedText] = useState('');
//   const [statusMessage, setStatusMessage] = useState("");

//   useEffect(() => {
//     const loadSqlJs = async () => {
//       const SQL = await initSqlJs({
//         locateFile: (file) =>
//           `https://cdn.jsdelivr.net/npm/sql.js@1.5.0/dist/${file}`,
//       });

//       setSqlInstance(SQL); // Simpan referensi ke SQL

//       // Cek apakah ada database di localStorage
//       const savedDb = localStorage.getItem("myDatabase");
//       let database;

//       if (savedDb) {
//         // Muat database dari localStorage
//         const binaryArray = Uint8Array.from(atob(savedDb), (c) => c.charCodeAt(0));
//         database = new SQL.Database(binaryArray);
//       } else {
//         // Buat database baru jika tidak ada di localStorage
//         database = new SQL.Database();
//       }

//       setDb(database);

//       // Cek apakah ada query yang tersimpan di localStorage
//       const savedQuery = localStorage.getItem("myQuery");
//       if (savedQuery) {
//         setQuery(savedQuery);
//       }
//     };

//     loadSqlJs();
//   }, []);

//   const saveDatabaseToLocalStorage = () => {
//     if (db) {
//       const data = db.export();
//       const base64Data = btoa(String.fromCharCode(...data));
//       localStorage.setItem("myDatabase", base64Data);
//       setStatusMessage("Query executed successfully!");
//     }
//   };

//   const saveQueryToLocalStorage = (query) => {
//     localStorage.setItem("myQuery", query);
//   };

//   const executeQuery = () => {
//     setStatusMessage("");
//     if (!db) return;

//     try {
//       const stmt = db.exec(selectedText);
//       setResult(stmt);
//       setStatusMessage("Query executed successfully!");
//       saveDatabaseToLocalStorage(); // Simpan database setelah kueri berhasil
//     } catch (error) {
//       console.error("Error executing query:", error);
//       setResult(null);
//       setStatusMessage(`Error executing query: ${error.message}`);
//     }
//   };

//   const handleMouseUp = () => {
//     const selection = window.getSelection().toString();
//     if (selection) {
//       setSelectedText(selection);
//     }
//   };

//   const handleQueryChange = (value) => {
//     setQuery(value);
//     saveQueryToLocalStorage(value);
//   };

//   const resetDatabaseAndQuery = () => {
//     setStatusMessage("");
//     if (sqlInstance) {
//       const newDb = new sqlInstance.Database(); // Gunakan instance SQL yang sudah disimpan
//       setDb(newDb);
//       setResult(null);
      
//       localStorage.removeItem("myDatabase");
      
//       setStatusMessage("Database Reset successfully!");
//     } else {
//       setStatusMessage("Error: SQL instance not loaded.");
//     }
//   };
  

//   return (
//     <div className="h-screen flex flex-col p-4 bg-gray-900 text-white">
//       <header className="item-center flex pl-5 w-full  items-center mb-2 py-2 justify-between bg-gray-800 text-center text-lg font-semibold shadow-lg">
//       <h1 className="mb-4 text-2xl font-bold">SQL Playground</h1>
//       </header>

//       <div onMouseUp={handleMouseUp} className="flex flex-1 gap-4 overflow-hidden">
//         <div className="editor flex-1 flex flex-col rounded-lg bg-gray-800 p-4">
          
//           <h5 className="mb-2 text-sm font-bold text-gray-400">SQL Editor</h5>
//           <Editor
//             height="100%"
//             defaultLanguage="sql"
//             value={query}
//             onChange={handleQueryChange}
//             theme="vs-dark"
//             options={{ minimap: { enabled: false } }}
//           />
//         </div>
//         <div className="flex-1 flex flex-col">
//           <div className="mb-4">
//             <button
//               onClick={executeQuery}
//               className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//             >
//               Run
//             </button>
//             <button
//               onClick={resetDatabaseAndQuery}
//               className="ml-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
//             >
//               Reset
//             </button>
//           </div>

//           {statusMessage && (
//             <p className={`mt-4 ${result ? 'text-green-600' : 'text-red-600'}`}>
//               {statusMessage}
//             </p>
//           )}
//           <div className="flex-1 overflow-auto rounded-lg border border-gray-200 p-4">
//             <h2 className="mb-2 text-lg font-semibold">Result:</h2>
//             {result && result.length > 0 ? (
//               <table className="min-w-full border border-gray-200 text-sm">
//                 <thead>
//                   <tr>
//                     {result[0].columns.map((col, index) => (
//                       <th
//                         key={index}
//                         className="border-b px-4 py-2 text-left uppercase bg-gray-700"
//                       >
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {result[0].values.map((row, rowIndex) => (
//                     <tr key={rowIndex} >
//                       {row.map((value, colIndex) => (
//                         <td
//                           key={colIndex}
//                           className="border-b px-4 py-2"
//                         >
//                           {value !== null ? value : 'NULL'}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>No results to display.</p>
//             )}
//           </div>
        
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LiveMySQL;
