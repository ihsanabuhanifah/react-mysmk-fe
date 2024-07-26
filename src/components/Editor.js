import { useCallback, useRef, useState } from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import { uploadFile } from "../api/guru/upload";
import Resizer from "react-image-file-resizer";
import { Dimmer, Loader } from "semantic-ui-react";

// import uploadToCloudinary from "./upload";
// import uploadToCloudinary from "./upload";

export default function Editor({ value, handleChange, ...props }) {
  const reactQuillRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageHandler = useCallback(() => {
    console.log("jalan");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        setIsLoading(true);
        console.log("input", input);
        const file = input.files[0];
        const image = await resizeFile(file);

        console.log("file", file);
        console.log("image", image);
        try {
          const res = await uploadFile(image);

          console.log("url", res.data.url);

          const url = res.data.url;
          const quill = reactQuillRef.current;
          if (quill) {
            const range = quill.getEditorSelection();
            range && quill.getEditor().insertEmbed(range.index, "image", url);
          }
        } catch {
          alert("upload gagal");
        } finally {
          setIsLoading(false);
        }
      }
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            
            zIndex: 50,
          }}
          className="fixed flex items-center justify-center "
        >
          <div>
            <Dimmer style={
              {
                backgroundColor: "rgba(255, 255,255, 0.5)", // semi-transparent white
                backdropFilter: "blur(0.5px)", // applies blur effect
              }
            } active inverted>
              <Loader size="large">Upload File Image </Loader>
            </Dimmer>
            
          </div>
        </div>
      )}
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        placeholder="Start writing..."
        modules={{
          toolbar: {
            container: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["code-block"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
          clipboard: {
            matchVisual: false,
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "video",
          "code-block",
        ]}
        value={value}
        {...props}
        onChange={(content) => {
          handleChange(content);
        }}
      />
    </>
  );
}

const resizeFile = async (file, rotate) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1000,
      1200,
      "JPEG",
      50,
      rotate,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
};
