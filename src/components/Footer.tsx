"use client";

import { profile } from "@/data/content";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90">
      <div className="section-container flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-slate-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-500">
          {profile.roles.join(" · ")}
        </p>
      </div>
    </footer>
  );
}
