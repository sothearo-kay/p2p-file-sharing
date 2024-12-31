import {
  useState,
  useRef,
  DragEvent,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import { Upload, AlertCircle } from "lucide-react";
import FileItem from "./file-item";

export interface FileWithPreview extends File {
  preview?: string;
}

const MAX_FILES = 5;

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const allFiles = [...files, ...newFiles];
      if (allFiles.length > MAX_FILES) {
        setError(`You can only upload up to ${MAX_FILES} files.`);
        return;
      }

      setError(null);

      const uniqueFiles = Array.from(
        new Map(allFiles.map((file) => [file.name, file])).values(),
      );

      const filesWithPreviews = uniqueFiles.map((file) => {
        if (file.type.startsWith("image/")) {
          return Object.assign(file, { preview: URL.createObjectURL(file) });
        }
        return file;
      });

      setFiles(filesWithPreviews);
    },
    [files],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      addFiles(newFiles);
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files);
      addFiles(newFiles);
    }
  };

  const handleDelete = (index: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      if (updatedFiles.length <= MAX_FILES) {
        setError(null);
      }
      return updatedFiles;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length > 0) {
      // Placeholder for file upload logic
      console.log(
        "Files submitted:",
        files.map((file) => file.name),
      );
      setFiles([]);
      setError(null);
    }
  };

  return (
    <div className="mx-auto max-w-[48rem] rounded-lg border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drag-and-Drop Area */}
        <div
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-300 ${
            isDragging
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload files by dragging or clicking"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop files here or
          </p>
          <p className="mt-1 text-sm font-semibold text-purple-500">
            Click to select files
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="*"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="flex items-center gap-2 rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              Selected Files:
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {files.map((file, index) => (
                <FileItem
                  key={index}
                  file={file}
                  handleDelete={() => handleDelete(index)}
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={files.length === 0}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FileUploader;
