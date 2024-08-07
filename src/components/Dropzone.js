import Dropzone from "react-dropzone";
import { uploadFile } from "../api/guru/upload";

const DropzoneFile = ({ handleDrop }) => {
  return (
    <>
      {" "}
      <Dropzone
        onDrop={async (acceptedFiles) => {
          console.log("acceptedFiles[0]", acceptedFiles[0]);
          const res = await uploadFile(acceptedFiles[0]);
          console.log("res", res);
          handleDrop(res.data.url);
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
              className="w-full h-full "
             
              variant="file"
              type="file"
            />

            <p>Upload File </p>
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default DropzoneFile;
