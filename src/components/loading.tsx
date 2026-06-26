import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
    </div>
  );
}
