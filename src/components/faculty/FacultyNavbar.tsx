"use client";

import { Menu } from "lucide-react";

interface FacultyNavbarProps {
  setSidebarOpen: (value: boolean) => void;
}

export default function FacultyNavbar({
  setSidebarOpen,
}: FacultyNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#C7D0B6] bg-[#DCE3CC]/90 backdrop-blur">
      
      <div className="flex items-center justify-between px-6 py-5">
        
        <div className="flex items-center gap-4">
          
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <Menu
              className="text-[#1F2937]"
              size={24}
            />
          </button>

          <h1 className="text-3xl font-bold text-[#1F2937]">
            Faculty Dashboard
          </h1>
        </div>

        {/* Faculty Badge */}
        <div className="rounded-full bg-[#355E3B] px-5 py-2 text-sm font-medium text-white">
          Verified Faculty
        </div>
      </div>
    </header>
  );
}