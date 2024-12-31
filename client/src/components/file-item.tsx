import { X, File } from "lucide-react";
import { FileWithPreview } from "./file-uploader";

interface FileItemProps {
  file: FileWithPreview;
  handleDelete: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, handleDelete }) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return null; // Images will use preview thumbnails
    if (fileType.includes("pdf")) return <File className="text-red-500" />;
    if (fileType.includes("doc")) return <File className="text-blue-500" />;
    return <File className="text-gray-500" />;
  };

  return (
    <div
      className={`overflow-hidden rounded-md bg-gray-100 ${
        file.type.startsWith("image/") ? "col-span-1" : "col-span-full"
      }`}
    >
      {file.type.startsWith("image/") ? (
        <div className="group relative">
          <img
            src={file.preview}
            alt={`Preview of ${file.name}`}
            className="aspect-video w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-red-500 p-2 text-white transition-colors duration-200 hover:bg-red-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 truncate bg-black bg-opacity-50 p-2 text-white">
            {file.name}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {getFileIcon(file.type)}
            <span className="truncate">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-2 flex-shrink-0 text-red-500 transition-colors duration-200 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileItem;