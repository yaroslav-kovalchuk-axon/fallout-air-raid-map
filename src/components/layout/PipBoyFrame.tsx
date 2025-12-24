"use client";

import { ReactNode } from "react";
import Header from "./Header";

interface PipBoyFrameProps {
  children: ReactNode;
  activeTab: "info" | "map";
}

export default function PipBoyFrame({ children, activeTab }: PipBoyFrameProps) {
  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="pipboy-frame w-full max-w-5xl">
        <div className="pipboy-screen min-h-[600px] md:min-h-[700px] flex flex-col">
          <Header activeTab={activeTab} />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
