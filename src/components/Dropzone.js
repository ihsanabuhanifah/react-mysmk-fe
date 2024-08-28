import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { uploadFileCalonSantri } from "../api/ppdb/uploadBerkas";
import { Loader, Dimmer } from "semantic-ui-react";

const DropzoneFile = ({ handleDrop }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dropzone
      onDrop={async (acceptedFiles) => {
        setIsLoading(true);
        try {
          console.log("acceptedFiles[0]", acceptedFiles[0]);
          const res = await uploadFileCalonSantri(acceptedFiles[0]);
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