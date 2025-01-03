import FileUploader from "../components/file-uploader";
import FileList from "../components/file-list";

export default function Home() {
  return (
    <div className="space-y-6">
      <FileUploader />
      <FileList />
    </div>
  );
}
