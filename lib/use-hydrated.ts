"use client";

import { useEffect, useState } from "react";
import { useLuxStore } from "@/lib/store";

export function useStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useLuxStore.persist.hasHydrated());
    return useLuxStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
