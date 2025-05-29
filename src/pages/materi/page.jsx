import { useLocation } from "react-router-dom";

export default function Materi() {
  const location = useLocation();

  console.log("loc", window.location.origin);

  return (
    <div
    
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <iframe
        src={`${window.location.origin}/site/index.html`}
        width="100%"
        height="100%"
        style={{ border: "none", position: "absolute", top: 0, left: 0 }}
        title="MkDocs Documentation"
      />
    </div>
  );
}
