"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

interface NavbarProps {
  setSidebarOpen: (
    value: boolean
  ) => void;
}

export default function Navbar({
  setSidebarOpen,
}: NavbarProps) {

  return (
    <header className="sticky top-0 z-30 border-b border-[#C7D0B6] bg-[#DCE3CC]/90 backdrop-blur">
      
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <Menu className="h-6 w-6 text-[#1E293B]" />
          </button>

          <Link href="/">
            <h1 className="text-3xl font-bold text-[#1F2937]">
              KnowledgeForest
            </h1>
          </Link>
        </div>

        {/* RIGHT */}
        <Link
          href="/login"
          className="rounded-xl bg-[#355E3B] px-5 py-3 text-white transition hover:bg-[#2d4f32]"
        >
          Faculty Login
        </Link>
      </div>
    </header>
  );
}