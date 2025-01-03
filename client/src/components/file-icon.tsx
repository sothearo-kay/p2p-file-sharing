import { File, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";

interface FileIconProps {
  fileType: string;
}

// prettier-ignore
const FileIcon: React.FC<FileIconProps> = ({ fileType}) => {
  if (fileType.includes("pdf")) return <FileTextIcon className="text-red-500" />;
  if (fileType.includes("doc")) return <File className="text-blue-500" />;
  if (fileType.includes("xlsx")) return <FileSpreadsheetIcon className="text-green-500" />;
  return <File className="text-gray-500" />;
};

export default FileIcon;
