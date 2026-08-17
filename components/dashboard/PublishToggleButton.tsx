"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, EyeOff, Loader2 } from "lucide-react";

interface PublishToggleButtonProps {
  id: string;
  isPublished: boolean;
}

export default function PublishToggleButton({ id, isPublished }: PublishToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/events/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublished: !isPublished }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update event visibility");
        }

        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        title={isPublished ? "Unpublish event" : "Publish event"}
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isPublished ? (
          <EyeOff className="w-3 h-3" />
        ) : (
          <Globe className="w-3 h-3" />
        )}
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
