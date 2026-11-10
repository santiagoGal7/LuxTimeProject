"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function AtelierLoader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem("luxtime-loader") === "1") return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("luxtime-loader", "1");
      setVisible(false);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="text-center">
            <p className="text-sm tracking-[0.42em] text-ink">
              LUX<span className="text-brass">TIME</span>
            </p>
            <motion.span
              className="mx-auto mt-4 block h-px w-24 bg-brass"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
