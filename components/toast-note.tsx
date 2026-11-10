"use client";

import { useLuxStore } from "@/lib/store";

export function ToastNote() {
  const notice = useLuxStore((state) => state.notice);
  const clear = useLuxStore((state) => state.clearNotice);
  if (!notice) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs border border-transparent bg-canvas px-4 py-3 text-sm shadow-line" role="status">
      <p>{notice}</p>
      <button type="button" className="btn btn-ghost mt-2" onClick={() => clear()}>
        Cerrar
      </button>
    </div>
  );
}
