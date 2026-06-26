import { FileQuestionIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <FileQuestionIcon className="text-muted-foreground size-12" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground mt-2">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
