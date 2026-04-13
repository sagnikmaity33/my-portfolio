"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER_SCROLL_PX = 240;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleBackToTop}
      className={`back-to-top-btn fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/70 bg-slate-900/85 text-emerald-300 shadow-lg shadow-emerald-500/30 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-200 ${
        isVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
