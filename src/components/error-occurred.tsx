import { AlertTriangleIcon } from "lucide-react";

export default function ErrorOccurred({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <AlertTriangleIcon className="text-destructive size-12" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}
