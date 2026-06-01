"use client";

import { useEffect, useState } from "react";

import FacultySidebar from "./FacultySidebar";
import FacultyNavbar from "./FacultyNavbar";

interface FacultyLayoutProps {
  children: React.ReactNode;
}

export default function FacultyLayout({
  children,
}: FacultyLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "auto";
    }

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [sidebarOpen]);

  return (
  <main className="min-h-screen bg-[#DCE3CC] text-[#1F2937]">
    
    <FacultySidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />

    <FacultyNavbar
      setSidebarOpen={setSidebarOpen}
    />

    <div className="px-6 py-6">
      {children}
    </div>

  </main>
);
}