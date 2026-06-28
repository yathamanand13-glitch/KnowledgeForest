"use client";

import { ReactNode, useEffect, useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: Props) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

    useEffect(() => {

  function handleResize() {

    if (window.innerWidth >= 1024) {

      setSidebarOpen(false);

    }

  }

  window.addEventListener(
    "resize",
    handleResize
  );

  return () =>
    window.removeEventListener(
      "resize",
      handleResize
    );

}, []);


useEffect(() => {

  if (sidebarOpen) {

    document.body.style.overflow = "hidden";

  } else {

    document.body.style.overflow = "auto";

  }

  return () => {

    document.body.style.overflow = "auto";

  };

}, [sidebarOpen]);

  return (

    <div className="min-h-screen bg-[#F5F7F2]">

      <AdminSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="lg:ml-[280px]">

        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">

          {children}

        </main>

      </div>

    </div>

  );

}