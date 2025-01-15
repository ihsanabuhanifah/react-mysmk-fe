import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { uploadFile } from "../api/guru/upload";
import { Loader, Dimmer } from "semantic-ui-react";

const DropzoneFile = ({ handleDrop }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dropzone
      // accept={{ "application/pdf": [".pdf"] }} // Membatasi hanya file PDF
       maxSize={1024 * 1024} // Membatasi ukuran maksimum 1 MB
      onDrop={async (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          alert("Hanya file PDF dengan ukuran maksimal 1 MB yang diizinkan.");
          return;
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
            <><p className="text-gray-300">Upload File </p>
            <p className="italic text-sm text-gray-300">(hanya pdf dan ukuran kurang dari 1 mb)</p></>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default DropzoneFile;
