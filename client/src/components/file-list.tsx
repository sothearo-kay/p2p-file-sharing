import { useEffect, useState } from "react";
import { useSocket } from "../context/socket-context";
import { Download, ImageIcon } from "lucide-react";
import { categorizeFiles } from "../utils/file-utils";
import FileIcon from "./file-icon";

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  type: string;
}

interface UploadCompleteData {
  fileId: string;
  fileName: string;
  size: number;
  file: string; // base64
  fileType: string;
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

        const fileBlob = new Blob(byteArrays);
        const fileURL = URL.createObjectURL(fileBlob);

        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          {
            name: data.fileName,
            size: data.size,
            url: fileURL,
            type: data.fileType,
          },
        ]);
      } catch (error) {
        console.error("Error decoding uploaded file:", error);
      }
    };

    socket.on("upload_complete", onUploadComplete);

    return () => {
      socket.off("upload_complete");
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [uploadedFiles]);

  if (!uploadedFiles.length) {
    return <p>No files uploaded yet.</p>;
  }

  const { imageFiles, otherFiles } = categorizeFiles(uploadedFiles);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {imageFiles.length > 0 && (
          <FileCategory title="Image Files" files={imageFiles} />
        )}

        {otherFiles.length > 0 && (
          <FileCategory title="Other Files" files={otherFiles} />
        )}
      </div>
    </div>
  );
};

const FileCategory: React.FC<{ title: string; files: UploadedFile[] }> = ({
  title,
  files,
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {files.map((file, index) => (
        <FileItem key={index} file={file} />
      ))}
    </div>
  </div>
);

const FileItem: React.FC<{ file: UploadedFile }> = ({ file }) => {
  const size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  const isImage = file.type.includes("image");

  if (isImage) {
    return (
      <div className="space-y-4 rounded-md border p-4">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="h-5 w-5 text-blue-500" />
          <p className="w-[80%] truncate font-semibold">{file.name}</p>
        </div>

        <div className="overflow-hidden rounded bg-gray-100">
          <img
            src={file.url}
            alt={file.name}
            className="aspect-video w-full object-cover"
          />
        </div>

        <p className="text-gray-500">Size: {size}</p>

        <div className="flex justify-end">
          <a href={file.url} download={file.name}>
            <button className="flex items-center gap-4 rounded border px-4 py-2 transition-colors hover:bg-gray-100">
              <Download className="h-5 w-5" /> Download
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-4">
      <div className="flex gap-4 overflow-hidden">
        <div className="rounded bg-gray-100 p-4">
          <FileIcon fileType={file.type} />
        </div>

        <div className="mt-0.5 overflow-hidden">
          <p className="truncate font-semibold">{file.name}</p>
          <p className="text-gray-500">Size: {size}</p>
        </div>
      </div>

      <a href={file.url} download={file.name}>
        <button className="rounded border p-2 px-3 transition-colors hover:bg-gray-100">
          <Download className="h-5 w-5" />
        </button>
      </a>
    </div>
  );
};

export default FileList;
