"use client";

import Link from "next/link";

interface HeaderProps {
  activeTab: "info" | "map";
}

export default function Header({ activeTab }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--pipboy-green-dark)]">
      <h1 className="text-xl md:text-2xl glow-text-bright font-[family-name:var(--font-pipboy)] tracking-wider">
        Vault-Tec UA
      </h1>

      <nav className="flex gap-4 md:gap-6 text-base md:text-lg font-[family-name:var(--font-pipboy)]">
        <Link
          href="/info"
          className={`nav-tab ${activeTab === "info" ? "nav-tab-active" : ""}`}
        >
          INFO
        </Link>
        <Link
          href="/map"
          className={`nav-tab ${activeTab === "map" ? "nav-tab-active" : ""}`}
        >
          MAP
        </Link>
      </nav>
    </header>
  );
}
