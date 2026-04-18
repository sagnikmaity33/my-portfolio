import { profile } from '@/data/content';
import { useEffect, useState } from 'react';

function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMailEnabled = process.env.NEXT_PUBLIC_MAIL_ENABLED !== "false";

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }

    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    const initial = prefersLight ? "light" : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // Persist theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const updateUrl = (url: URL) => {
    const search = url.searchParams.toString();
    const nextUrl = `${url.pathname}${search ? `?${search}` : ""}${url.hash}`;
    window.history.replaceState({}, "", nextUrl);
  };

  const clearReferralIntent = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("mode") !== "referral") return;
    url.searchParams.delete("mode");
    updateUrl(url);
  };

  const handleReferralClick = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("mode", "referral");
    url.hash = "contact";
    updateUrl(url);
    window.dispatchEvent(new Event("referral-intent-change"));
    document.querySelector<HTMLElement>("#contact")?.scrollIntoView({
      behavior: "smooth",
    });
    setIsMobileNavOpen(false);
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-transparent">
        <div
          className="h-full bg-emerald-500/80 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="section-container flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-emerald-400/80 bg-emerald-500/20 shadow-lg shadow-emerald-500/40">
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-emerald-300">
                TT
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-100">
                {profile.name}
              </span>
              <span className="text-xs text-slate-400">
                {profile.title} · {profile.location}
              </span>
            </div>
          </div>
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="nav-link"
                onClick={() => {
                  if (section.id === "contact") {
                    clearReferralIntent();
                  }
                }}
              >
                {section.label}
              </a>
            ))}
            {isMailEnabled ? (
              <button
                type="button"
                className="nav-link"
                onClick={handleReferralClick}
              >
                Referral
              </button>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm shadow-black/40 transition hover:border-emerald-400 hover:text-emerald-300"
              aria-label="Toggle color theme"
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-slate-500"
                style={{
                  background:
                    theme === "dark"
                      ? "radial-gradient(circle at 30% 30%, #22c55e, #020617)"
                      : "radial-gradient(circle at 30% 30%, #f97316, #f9fafb)",
                }}
              />
              <span className="hidden sm:inline">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="mobile-menu-btn inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/60 text-slate-200 shadow-sm shadow-black/40 transition hover:border-emerald-400 hover:text-emerald-300 md:hidden"
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileNavOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="flex flex-col gap-0.5">
                <span className="block h-[2px] w-4 rounded-full bg-current" />
                <span className="block h-[2px] w-4 rounded-full bg-current" />
                <span className="block h-[2px] w-4 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
        {/* Mobile nav dropdown */}
        {isMobileNavOpen && (
          <div
            className={`border-t md:hidden ${
              theme === "light"
                ? "border-slate-200 bg-white"
                : "border-slate-800/80 bg-slate-950/95"
            }`}
          >
            <nav className="section-container flex flex-col gap-1 py-3">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="nav-link py-1.5"
                  onClick={() => {
                    if (section.id === "contact") {
                      clearReferralIntent();
                    }
                    setIsMobileNavOpen(false);
                  }}
                >
                  {section.label}
                </a>
              ))}
              {isMailEnabled ? (
                <button
                  type="button"
                  className="nav-link py-1.5 text-left"
                  onClick={handleReferralClick}
                >
                  Referral
                </button>
              ) : null}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;