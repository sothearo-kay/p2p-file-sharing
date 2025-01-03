import { useEffect, useState } from "react";
import { useSocket } from "../context/socket-context";

interface UploadedFile {
  name: string;
  size: number;
  url: string;
}

interface UploadCompleteData {
  fileId: string;
  fileName: string;
  size: number;
  file: string; // base64
}

const FileList: React.FC = () => {
  const socket = useSocket();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (!socket) return;

    const onUploadComplete = (data: UploadCompleteData) => {
      try {
        // Decode base64 string and create a downloadable File
        const byteCharacters = atob(data.file);
        const byteArrays: Uint8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Uint8Array(
            Array.from(slice).map((char) => char.charCodeAt(0)),
          );
          byteArrays.push(byteNumbers);
        }

        const fileBlob = new Blob(byteArrays, { type: "image/png" });
        const fileURL = URL.createObjectURL(fileBlob);

        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          {
            name: data.fileName,
            size: data.size,
            url: fileURL,
          },
        ]);
      } catch (error) {
        console.error("Error decoding uploaded file:", error);
      }
    };

    socket.on("upload_complete", onUploadComplete);

    return () => {
      socket.off("upload_complete", onUploadComplete);
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [uploadedFiles]);

  return (
    <div>
      <ul>
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, index) => (
            <li key={index}>
              <a href={file.url} download={file.name}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </a>
            </li>
          ))
        ) : (
          <li>No files uploaded yet.</li>
        )}
      </ul>
    </div>
  );
};

export default FileList;
