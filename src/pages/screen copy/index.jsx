import { useContext, useEffect, useState, useReducer } from "react";
import { SocketContext } from "../SocketContext";
import Peer from "peerjs";
import VideoPlayer from "./VideoPlayer";
import { peerReducer } from "../../../Context/peerReducer";
import { addPeerAction } from "../../../Context/peerAction";
export default function Monitoring() {
  const socket = useContext(SocketContext);

  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [peers, dispatch] = useReducer(peerReducer, {});

  const createRoom = () => {
    const peer = new Peer(new Date().getTime());
    setMe(peer);

    try {
      navigator.mediaDevices
        .getDisplayMedia({
          video: {
            curson: "always",
            displaySurface: "monitor",
          },
          audio  : false
        })
        .then((stream) => {
          setStream(stream);
        });
      //   navigator.mediaDevices
      //     .getUserMedia({ video: true, audio: true })
      //     .then((stream) => {
      //       setStream(stream);
      //     });
    } catch (error) {
      console.log("err");
    }
  };

  console.log("me", me);
  const handleRoom = () => {
    const roomId = new Date().getTime();
    socket.emit("create_room", { roomId: 12345678 });
    socket.emit("user-join", { peerId: me._id });
  };

  useEffect(() => {
    if (!socket) return;

    console.log("jalan");

    socket.on("user-join.reply", ({ peerId }) => {
      console.log("masuk user-join", peerId);
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        console.log("peer stream", peerStream);
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        console.log("peer", peerStream);
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });

    return () => {
      socket.off("create_room.reply");
      socket.off("user-join.reply");
    };
  }, [socket, stream, me]);

  useEffect(() => {
    createRoom();
  }, []);

  console.log({ peers });

  console.log("soce", socket);
  return (
    <div>
      <button
        onClick={() => {
          handleRoom();
        }}
        className="bg-red-500"
      >
        Join
      </button>

      <div className="grid grid-cols- gap-5">
        <VideoPlayer stream={stream} autoPlay muted={true} />
        {Object.values(peers).map((peer) => (
          <VideoPlayer stream={peer.stream} autoPlay muted={true} />
        ))}
      </div>
    </div>
  );
}
