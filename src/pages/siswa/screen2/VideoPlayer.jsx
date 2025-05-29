import { useEffect, useRef } from "react";

export default function VideoPlayer({ stream, ...props }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return <video {...props} ref={videoRef}></video>;
}
