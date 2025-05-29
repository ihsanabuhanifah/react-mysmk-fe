// import React, { useContext, useEffect, useRef, useState } from "react";
// import { SocketContext } from "../../siswa/SocketContext";
// import { useZUStore } from "../../../zustand/zustore";
// import LayoutPage from "../../../module/layoutPage";
// import { useQuery } from "react-query";
// import { listSiswa } from "../../../api/guru/siswa";
// import { LoadingPage } from "../../../components";
// import { Input } from "semantic-ui-react";
// import { IoArrowBack, IoSend, IoSendOutline } from "react-icons/io5";
// import { BubleChat } from "../../siswa/chatsiswa/chatsiswa";

// const ChatGuru = () => {
//   const socket = useContext(SocketContext);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [idSiswa, setIdSiswa] = useState(null);
//   const [namaSiswa, setNamaSiswa] = useState(null);
//   const [search, setSearch] = useState("");
//   const textareaRef = useRef(null);

//   const { profile } = useZUStore((state) => state);

//   let { data, isLoading } = useQuery(["siswa/list"], () => listSiswa(), {
//     refetchOnWindowFocus: false,
//     select: (response) => {
//       return response.data.data.rows;
//     },
//   });

//   const handleInput = (e) => {
//     setMessage(e.target.value);
//     textareaRef.current.style.height = "50px";
//     textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; // Sesuaikan tinggi
//   };

//   useEffect(() => {
//     if (idSiswa && textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   }, [idSiswa]);

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       if (event.ctrlKey) {
//         setMessage((prev) => prev + "\n");
//         textareaRef.current.style.height = "50px"; // Reset height
//         textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
//       } else {
//         event.preventDefault(); // Mencegah perilaku default Enter (misalnya, mengirim form)
//         sendMessage();
//       }
//     }
//   };

//   useEffect(() => {
//     if (!socket) return;
//     socket.on("message", (msg) => {
//       console.log(msg.pengirim)
//       console.log(idSiswa)
//       if(Number(msg.pengirim) === idSiswa) {
//         setMessages((prev) => ([...prev, msg]))
//       }
//     });
//     return () => {
//       socket.off("message");
//     };
//   }, [socket, idSiswa]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit("message", {
//         text: message,
//         pengirim: profile.user_id,
//         penerima: idSiswa,
//         role: profile.user.role,
//       });
//       setMessages((prev) => [
//         ...prev,
//         {
//           text: message,
//           pengirim: profile.user_id,
//           penerima: idSiswa,
//           id: Date.now(),
//         },
//       ]);
//       setMessage("");
//     }
//   };

//   if (isLoading) {
//     return <LoadingPage />;
//   }

//   const filteredSiswa = data.filter((v) =>
//     v.siswa.nama_siswa.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <LayoutPage title="Chat">
//       {!idSiswa ? (
//         <section className="h-full xl:hidden">
//           <Input
//             fluid
//             loading={false}
//             icon="search"
//             onChange={(e) => {
//               setSearch(e.target.value);
//             }}
//             iconPosition="left"
//             placeholder="Search..."
//             className="mb-2"
//           />
//           {filteredSiswa?.map((_, i) => (
//             <div>
//               <div
//                 onClick={() => {
//                   setIdSiswa(_.siswa.user_id);
//                   setNamaSiswa(_.siswa.nama_siswa);
//                 }}
//                 key={i}
//                 className={`${_.siswa.user_id === idSiswa && "bg-gray-100"} mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-3 font-semibold transition-all duration-100 hover:bg-gray-100`}
//               >
//                 <div className="h-[40px] w-[40px] rounded-full bg-red-200"></div>
//                 <p className="">{_.siswa.nama_siswa}</p>
//               </div>
//             </div>
//           ))}
//         </section>
//       ) : (
//         <section className="flex h-full flex-col xl:hidden">
//           <div className="flex items-center gap-2 border-b px-3 pb-1">
//             <IoArrowBack
//               className="cursor-pointer"
//               size={20}
//               onClick={() => {
//                 setIdSiswa(null);
//                 setNamaSiswa(null);
//               }}
//             />
//             <p className="font-black">{namaSiswa}</p>
//           </div>
//           <div className="w-full flex-grow overflow-y-auto py-2 pr-2">
//             {messages.map((_, i) => {
//               return (
//                 <BubleChat
//                   rl={_.pengirim === profile.user_id}
//                   text={_.text}
//                   time={_.id}
//                 />
//               );
//             })}
//           </div>
//           <div className="grid h-auto w-full grid-cols-12 gap-2 border-t pt-1">
//             <div className="col-span-11">
//               <Input
//                 fluid
//                 value={message}
//                 loading={false}
//                 onChange={(e) => {
//                   setMessage(e.target.value);
//                 }}
//                 placeholder="Ketik pesan"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={() => sendMessage()}
//               className="col-span-1"
//             >
//               <IoSend className="my-auto text-blue-700" size={20} />
//             </button>
//           </div>
//         </section>
//       )}

//       <section className="hidden h-full w-full xl:flex">
//         <div className="flex h-full w-[20vw] flex-col gap-2 overflow-y-auto border-r pr-1">
//           <Input
//             fluid
//             loading={false}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Cari murid..."
//           />
//           <div className="flex-grow overflow-y-auto pr-2">
//             {filteredSiswa.map((_, i) => {
//               return (
//                 <div
//                   onClick={() => {
//                     setIdSiswa(_.siswa.user_id);
//                     setNamaSiswa(_.siswa.nama_siswa);
//                   }}
//                   key={i}
//                   className={`${_.siswa.user_id === idSiswa && "bg-gray-100"} mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-3 font-semibold transition-all duration-100 hover:bg-gray-100`}
//                 >
//                   <div className="h-[40px] w-[40px] rounded-full bg-red-200"></div>
//                   <p className="">{_.siswa.nama_siswa}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="hidden h-[85vh] flex-grow flex-col pl-2 xl:flex">
//           {!idSiswa ? (
//             <div className="flex h-full w-full items-center justify-center">
//               <p className="text-lg opacity-70"> -- Pilih Siswa -- </p>
//             </div>
//           ) : (
//             <div className="flex h-full flex-col">
//               <div className="w-full border-b pb-3">
//                 <p className="text-xl font-semibold">{namaSiswa}</p>
//               </div>
//               <div className="w-full flex-grow overflow-y-auto py-3 pr-2">
//                 {messages.map((_, i) => {
//                   return (
//                     <BubleChat
//                       rl={_.pengirim === profile.user_id}
//                       text={_.text}
//                       time={_.id}
//                     />
//                   );
//                 })}
//               </div>
//               <div className="h-auto w-full border-t">
//                 <textarea
//                   ref={textareaRef}
//                   value={message}
//                   onChange={handleInput}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Ketik pesan.."
//                   className="focus:outline-none w-[95%] resize-none rounded-md border-none px-3 py-2 text-lg"
//                   style={{
//                     maxHeight: "120px",
//                     overflow: "auto",
//                     height: "50px",
//                   }}
//                 />
//                 <button onClick={() => sendMessage()} className="w-[5%]">
//                   <IoSendOutline size={30} className="ml-auto" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </LayoutPage>
//   );
// };

// export default ChatGuru;
