import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../SocketContext";
import { useZUStore } from "../../../zustand/zustore";
import { useQuery } from "react-query";
import { listGuru } from "../../../api/list";
import { LoadingPage } from "../../../components";
import LayoutSiswa from "../../../module/layoutSiswa";
import { Input } from "semantic-ui-react";
import { IoArrowBack, IoSendOutline } from "react-icons/io5";
import { format } from "date-fns";
import useChatModule from "../../../hook/useChatModule";

const ChatSiswa = () => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [idGuru, setIdGuru] = useState(null);
  const [namaGuru, setNamaGuru] = useState(null);
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { profile } = useZUStore((state) => state);
  const { data: dataChat, isLoading: loadChat } = useChatModule(
    idGuru,
    profile.user_id,
  );

  let { data, isLoading } = useQuery(["/list/guru"], () => listGuru(), {
    select: (res) => {
      return res.data.data;
    },
  });

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (msg) => {
      if (Number(msg.teacher_id) === idGuru) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socket.off("message");
    };
  }, [socket, idGuru]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", {
        id: Date.now(),
        text: message,
        student_id: profile.user_id,
        teacher_id: idGuru,
        role: profile.user.role,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: message,
          student_id: profile.user_id,
          teacher_id: idGuru,
          role: profile.user.role,
        },
      ]);
      setMessage("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIdGuru(null);
        setNamaGuru(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleInput = (e) => {
    setMessage(e.target.value);
    textareaRef.current.style.height = "50px";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; // Sesuaikan tinggi
  };

  useEffect(() => {
    if (idGuru && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [idGuru]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.ctrlKey) {
        setMessage((prev) => prev + "\n");
        textareaRef.current.style.height = "50px"; // Reset height
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      } else {
        event.preventDefault(); // Mencegah perilaku default Enter (misalnya, mengirim form)
        sendMessage();
      }
    }
  };

  useEffect(() => {
    let historyChat;

    if (dataChat) {
      historyChat = JSON.parse(dataChat.message);
      setMessages(historyChat);
    } else {
      setMessages([]);
    }
  }, [idGuru, dataChat]);

  const scrollToRef = useRef(null);

  useEffect(() => {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [scrollToRef, idGuru, messages]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const filteredGuru = data.filter((guru) =>
    guru.nama_guru.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <LayoutSiswa title="Chat">
      <div className="mt-4 flex w-full px-5">
        {!idGuru && (
          <div className="w-full xl:hidden">
            <Input
              fluid
              loading={false}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guru..."
            />
            <div className="mt-2 flex-grow overflow-y-auto">
              {filteredGuru.map((_, i) => {
                return (
                  <div
                    onClick={() => {
                      setIdGuru(_.user.id);
                      setNamaGuru(_.nama_guru);
                    }}
                    key={i}
                    className={`${_.user.id === idGuru && "bg-gray-100"} mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-3 font-semibold transition-all duration-100 hover:bg-gray-100`}
                  >
                    <div className="h-[40px] w-[40px] rounded-full bg-red-200"></div>
                    <p className="">Ust. {_.nama_guru.split(" ")[0]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {idGuru && (
          <div className="w-full xl:hidden">
            <div className="flex h-full flex-col">
              <div className="fixed left-0 right-0 top-[142.2px] flex w-full items-center border-b bg-white px-4 py-3">
                <IoArrowBack
                  size={20}
                  className="mr-2 cursor-pointer"
                  onClick={() => {
                    setIdGuru(null);
                    setNamaGuru(null);
                  }}
                />
                <p className="text-xl font-semibold">Ust. {namaGuru}</p>
              </div>
              <div className="w-full flex-grow overflow-y-auto py-[50px] pr-2">
                {messages.map((_, i) => {
                  return (
                    <BubleChat
                      rl={_.teacher_id === profile.user_id}
                      text={_.text}
                      time={_.id}
                    />
                  );
                })}
                <div ref={scrollToRef}></div>
              </div>
              <div className="fixed bottom-0 left-0 right-0 flex h-[60px] w-full border-t bg-white px-5 py-2">
                <Input
                  className="mr-2 w-[95%]"
                  loading={false}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ketik pesan.."
                />
                <button onClick={() => sendMessage()} className="h-full w-[5%]">
                  <IoSendOutline size={30} className="my-auto ml-auto" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============== */}
        <div className="hidden h-[85vh] w-[20vw] flex-col gap-2 border-r pr-2 xl:flex">
          <Input
            fluid
            loading={false}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari guru..."
          />
          <div className="flex-grow overflow-y-auto pr-2">
            {filteredGuru.map((_, i) => {
              return (
                <div
                  onClick={() => {
                    setIdGuru(_.user.id);
                    setNamaGuru(_.nama_guru);
                  }}
                  key={i}
                  className={`${_.user.id === idGuru && "bg-gray-100"} mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-3 font-semibold transition-all duration-100 hover:bg-gray-100`}
                >
                  <div className="h-[40px] w-[40px] rounded-full bg-red-200"></div>
                  <p className="">Ust. {_.nama_guru.split(" ")[0]}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden h-[85vh] flex-grow flex-col pl-2 xl:flex">
          {!idGuru ? (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-lg opacity-70"> -- Pilih Guru -- </p>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="w-full border-b pb-3">
                <p className="text-xl font-semibold">Ust. {namaGuru}</p>
              </div>
              <div className="w-full flex-grow overflow-y-auto py-3 pr-2">
                {messages.map((_, i) => {
                  return (
                    <BubleChat
                      rl={_.role === "siswa"}
                      text={_.text}
                      time={_.id}
                    />
                  );
                })}
                <div ref={scrollToRef}></div>
              </div>
              <div className="h-auto w-full border-t">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan.."
                  className="focus:outline-none w-[95%] resize-none rounded-md border-none px-3 py-2 text-lg"
                  style={{
                    maxHeight: "120px",
                    overflow: "auto",
                    height: "50px",
                  }}
                />
                <button onClick={() => sendMessage()} className="w-[5%]">
                  <IoSendOutline size={30} className="ml-auto" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutSiswa>
  );
};

export default ChatSiswa;

export const BubleChat = ({ text, rl, time }) => {
  if (time) {
    const date = new Date(time);
    const formated = format(new Date(date), "HH:mm");
    time = formated;
  }

  return (
    <div className={`${rl ? "text-right" : "text-left"}`}>
      <div
        style={{ wordWrap: "break-word" }}
        className={`mb-4 inline-block max-w-[70vw] rounded-lg bg-blue-500 text-left xl:max-w-[30vw] ${rl ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} p-3 text-white`}
      >
        <p>
          {text}
          <span
            className={`block ${rl ? "text-right" : "text-left"} text-xs opacity-60`}
          >
            {time}
          </span>
        </p>
      </div>
    </div>
  );
};
