  import { useCallback, useEffect, useRef, useState } from "react";
  import ReactQuill from "react-quill";
  import "./component.css";
  import { uploadFile } from "../api/guru/upload";
  import Resizer from "react-image-file-resizer";
  import { Dimmer, Loader, Message, MessageHeader } from "semantic-ui-react";
  import "katex/dist/katex.min.css";
  import katex from "katex";
  import clsx from "clsx";
import { debounce } from "lodash";
  window.katex = katex;

  // import uploadToCloudinary from "./upload";
  // import uploadToCloudinary from "./upload";

  export default function Editor({ value, handleChange, error, ...props }) {

    const reactQuillRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const imageHandler = useCallback(() => {
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

    // useEffect(() => {
    //   const editor = reactQuillRef.current.getEditor();
    //   editor.root.addEventListener("DOMSubtreeModified", () => {
    //     katex.render(editor.root.innerHTML, editor.root, {
    //       throwOnError: false,
    //     });
    //   });
    // }, []);

    const renderMath = useCallback(
      debounce(() => {
        const editor = reactQuillRef.current.getEditor();
        const editorContent = editor.root.innerHTML;
        
        // Render KaTeX math
        // katex.render(editorContent, editor.root, {
        //   throwOnError: false,
        // });

        const latexRegex = /\$(.*?)\$/g;
      const latexMatches = editorContent.match(latexRegex);

      if (latexMatches) {
        latexMatches.forEach((latex) => {
          try {
            const rendered = katex.renderToString(latex.replace(/\$/g, ''), {
              throwOnError: false,
            });

            // Replace LaTeX dengan versi yang dirender
            editor.root.innerHTML = editor.root.innerHTML.replace(
              latex,
              rendered
            );
          } catch (error) {
            console.error("KaTeX render error:", error);
          }
        });
      }
      }, 500), // Delay 500ms to avoid rendering on every small change
      []
    );
  
    useEffect(() => {
      const editor = reactQuillRef.current.getEditor();
  
      // Listen for content changes in Quill editor
      editor.on("text-change", () => {
        renderMath(); // Call debounced function to render math
      });
  
      // Cleanup: remove event listener when component unmounts
      return () => {
        editor.off("text-change");
      };
    }, [renderMath]);

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
              <Dimmer
                style={{
                  backgroundColor: "rgba(255, 255,255, 0.5)", // semi-transparent white
                  backdropFilter: "blur(0.5px)", // applies blur effect
                }}
                active
                inverted
              >
                <Loader size="large">Upload File Image </Loader>
              </Dimmer>
            </div>
          </div>
        )}
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          className={clsx(`quill-editor`, {
            " border  border-[#E0B4B4]": error,
          })}
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
                ["link", "image", "video", "formula"],
                ["code-block"],
              ],
              handlers: {
                image: imageHandler,
              },
              clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
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
            "formula",
            "color",
            "background",
            "align",
            "code-block",
            "script",
            "",
          ]}
          value={value}
          {...props}
          onChange={(content) => {
            handleChange(content);
            // renderMathJax()
          }}
        />

        {error && (
          <Message negative>
            <MessageHeader>Wajib isi</MessageHeader>
          </Message>
        )}
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
