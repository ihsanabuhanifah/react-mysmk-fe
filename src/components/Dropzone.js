import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { uploadFile } from "../api/guru/upload";
import { Loader, Dimmer } from "semantic-ui-react";

const DropzoneFile = ({ handleDrop }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dropzone
      onDrop={async (acceptedFiles) => {
        // Ambil file pertama dari array acceptedFiles
        const file = acceptedFiles[0];

        // Validasi ukuran file
        if (file.size > 1 * 1024 * 1024) {
          // 10 KB
          alert("File anda terlalu besar! Maksimal 1 MB.");
          return; // Hentikan proses jika file terlalu besar
        }
        setIsLoading(true);

        try {
          console.log("acceptedFiles[0]", acceptedFiles[0]);
          const res = await uploadFile(acceptedFiles[0]);
          console.log("res", res);
          handleDrop(res.data.url);
        } catch (error) {
          console.error("Upload failed:", error);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps({
            className: `text-center border-dashed border-4 ${
              false ? "border-red-100" : "border-light-blue-500"
            } w-full p-5 col-span-4 relative`,
          })}
        >
          <input
            {...getInputProps()}
            className="w-full h-full"
            variant="file"
            type="file"
          />

          {isLoading ? (
            <Dimmer active inverted>
              <Loader size="small">Uploading...</Loader>
            </Dimmer>
          ) : (
            <p>Upload File</p>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default DropzoneFile;
